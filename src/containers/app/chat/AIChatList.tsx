import React from 'react'

import { useLiveQuery } from 'dexie-react-hooks'
import { Plus, Sparkles, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useSidebarContext } from '@/containers/app/SidebarLayout'
import { useNewRequestDialog } from '@/containers/app/NewRequestDialog'
import axiosInstance from '@/lib/axios'
import { dateToNaturalLanguage } from '@/lib/date'
import db from '@/lib/db'
import { CHAT_AI } from '@/types/chat'

// Set total number of chat to be fetched in one request
const PAGE_SIZE = 10 as const

const AIChatList = () => {
    // Hold internal states
    const [needLoadMore, setNeedLoadMore] = React.useState<boolean>(false)

    // Use app context
    const { search } = useSidebarContext()
    const { setIsOpen } = useNewRequestDialog()

    // Get chats from indexed DB
    const chats = useLiveQuery(() => db.chats.orderBy('updatedAt').reverse().filter(chat => chat.type === 'AI' && chat.title.toLowerCase().includes(search.toLowerCase())).toArray(), [search])
    const lastId = React.useMemo(() => {
        if (chats && chats.length > 0) {
            return chats[chats.length - 1].id
        }
        return null
    }, [chats])

    const navigate = useNavigate()
    const { pathname } = useLocation()

    // Fetch more {PAGE_SIZE} chats from the given latest ID
    const loadMore = React.useCallback(async () => {
        axiosInstance.get(`/api/v1/chat-tools/chat?type=AI&lastId=${lastId}&limit=${PAGE_SIZE}&sort=updatedAt:desc&projection=id,title,type,item,folder,createdAt,updatedAt,generations`)
            .then(res => {
                db.chats.bulkPut(res.data.data)
                if (res.data.data.length < PAGE_SIZE) {
                    setNeedLoadMore(false)
                }
            })
    }, [lastId])

    // Fetch first {PAGE_SIZE} chat sorted by updatedAt descending on page load
    React.useEffect(() => {
        axiosInstance.get(`/api/v1/chat-tools/chat?type=AI&page=1&limit=${PAGE_SIZE}&sort=updatedAt:desc&projection=id,title,type,item,folder,createdAt,updatedAt,generations`)
            .then(async res => {
                db.chats.where('type').equals(CHAT_AI).delete().then(() => {
                    db.chats.bulkPut(res.data.data)
                    if (res.data.data.length === PAGE_SIZE) {
                        setNeedLoadMore(true)
                    }
                })
            })
    }, [])

    return  (
        <div className='flex flex-col gap-2'>
            {chats && chats.length > 0 ? (
                <>
                    {chats.map(chat => (
                        <div key={chat.id} onClick={() => { navigate(`/app/chat/${chat.id}`) }} className={`cursor-pointer flex flex-col gap-2 rounded-xl ${pathname.endsWith(chat.id) ? 'bg-neutral-200' : 'bg-white'} border-2 border-neutral-300 p-4 relative`}>
                            <img src={chat.generations?.slice(-1)[0]?.url as string } alt={chat.title} className='h-16 w-auto self-start rounded-sm border-2 border-white shadow-xl -rotate-5' />
                            <div className='flex flex-col'>
                                <h1 className='text-sm font-bold'>{chat.title}</h1>
                                <p className='text-xs text-neutral-500'>Last updated {dateToNaturalLanguage(new Date(chat.updatedAt))}</p>
                            </div>
                            {chat.type === 'AI' ? <Sparkles className='absolute top-2 right-2' color='var(--color-neutral-500)' size={16} /> : <User className='absolute top-2 right-2' color='var(--color-neutral-500)' size={16} />}
                        </div>
                    ))}
                    {needLoadMore && <Button onClick={loadMore}>Load More AI</Button>}
                </>
            ) : (
                <div className='cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl bg-white border-2 border-neutral-300 p-4 relative' onClick={() => setIsOpen(true)}>
                    <p className='text-sm'>Add new request</p>
                    <Plus color='var(--color-neutral-500)' size={16} />
                </div>
            )}
        </div>
    )
}

export default AIChatList