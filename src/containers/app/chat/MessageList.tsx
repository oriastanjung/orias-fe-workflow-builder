import React from "react"

import { useLiveQuery } from "dexie-react-hooks"
import { toast } from "sonner"

import axiosInstance from '@/lib/axios'
import db from "@/lib/db"
import MessageBubble from "@/containers/app/chat/MessageBubble"
import { Button } from "@/components/ui/button"

type MessageListType = {
    chatId: string
    process?: string
}

// Set total number of message to be fetched in one request
const PAGE_SIZE = 20 as const

const MessageList = ({ chatId, process }: MessageListType) => {
    // Hold internal states
    const [needLoadMore, setNeedLoadMore] = React.useState<boolean>(false)

    // Get messages from indexed DB
    const messages = useLiveQuery(() => db.messages.orderBy('createdAt').reverse().filter(message => message.chatId === chatId).toArray(), [chatId])
    const lastId = React.useMemo(() => {
        if (messages && messages.length > 0) {
            return messages[0].id
        }
        return null
    }, [messages])

    // Fetch more {PAGE_SIZE} chats from the given last ID
    const loadMore = React.useCallback(() => {
        toast.promise(async () => {
            const response = await axiosInstance.get(`/api/v1/chat-tools/message?lastId=${lastId}&limit=${PAGE_SIZE}&sort=createdAt:desc`)
            return response.data.data
        }, {
            loading: 'Loading more messages',
            success: data => {
                db.messages.bulkPut(data)
                if (data.length < PAGE_SIZE) {
                    setNeedLoadMore(false)
                }
                return 'Success getting more messages'
            },
            error: 'An error occured'
        })
    }, [lastId])

    // Fetch first {PAGE_SIZE} message sorted by updatedAt descending on page load
    React.useEffect(() => {
        console.log('AAAA', chatId, messages)
        if (chatId && messages) {
            toast.promise(async () => {
                const url =
                    messages.length === 0 ?
                    `/api/v1/chat-tools/message?chatId=${chatId}&page=1&limit=${PAGE_SIZE}&sort=createdAt:desc` :
                    `/api/v1/chat-tools/message?chatId=${chatId}&lastId=${lastId}&sort=createdAt:asc`

                const response = await axiosInstance.get(url)
                return response.data.data
            }, {
                loading: 'Getting messages',
                success: data => {
                    db.messages.bulkPut(data)
                    if (messages.length === 0 && data.length === PAGE_SIZE) {
                        setNeedLoadMore(true)
                    }
    
                    return 'Success getting message'
                },
                error: 'An error occured'
            })
        }
    }, [messages])

    return (
        <div className='flex-1 flex flex-col-reverse gap-2 items-start'>
            {messages && messages.length > 0 ? (
                <>
                    {process && <MessageBubble isProcessing message={{ chatId, content: process, createdAt: new Date().toString(), direction: 'incoming', id: '', updatedAt: new Date().toString() }} />}
                    {messages.map(message => <MessageBubble message={message} />)}
                    {needLoadMore && <Button variant='ghost' onClick={loadMore} className='self-center'>Load More</Button>}
                </>
            ) : (
                <div>
                    <h1>No Message</h1>
                </div>
            )}
        </div>
    )
}

export default MessageList