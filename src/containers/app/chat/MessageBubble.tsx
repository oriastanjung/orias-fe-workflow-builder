import React from 'react'

import { File } from 'lucide-react'

import { dateToWhatsappKindaFormat } from '@/lib/date'
import { type Message, MESSAGE_OUTGOING } from '@/types/message'

type MessageBubbleProps = {
    message: Message
    isProcessing?: boolean
}

// This component is used to render dot loading
const Dots = ({ max = 3 }: { max?: number }) => {
    const [number, setNumber] = React.useState<number>(0)

    React.useEffect(() => {
        setTimeout(() => {
            setNumber(prev => (prev + 1) % max)
        }, 500)
    }, [number])

    return Array.from(Array(number + 1).fill('.')).join('')
}

const MessageBubble = ({ message, isProcessing }: MessageBubbleProps) => {
    return (
        <div className={`max-w-[80%] ${message.direction === MESSAGE_OUTGOING && 'self-end'} flex flex-col gap-2 ${message.direction === MESSAGE_OUTGOING ? 'items-end' : 'items-start'}`}>
            {message.content && (
                <div className={`prose p-2 ${message.direction === MESSAGE_OUTGOING ? 'bg-slate-100 border-1 border-slate-300' : 'bg-neutral-100'} rounded-xl ${message.direction === MESSAGE_OUTGOING ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                    <pre className='whitespace-pre-wrap mb-0 p-0 bg-transparent text-neutral-700 font-sans-serif'>{message.content}{isProcessing && <Dots />}</pre>
                    <p className='mt-0 text-xs text-neutral-500'>{dateToWhatsappKindaFormat(new Date(message.createdAt))}</p>
                </div>
            )}
            {message.context && (
                <div className='flex items-start gap-2'>
                    {message.context.map(ctx => {
                        const style: React.CSSProperties = {}
                        if (ctx.type.startsWith('image')) {
                            style.backgroundImage = `url(${ctx.content})`
                            style.backgroundSize = 'cover'
                            style.backgroundPosition = 'center'
                        }
                        const filenames = ctx.content.split('/')
                        const filename = filenames[filenames.length - 1]
                        return (
                            <div onClick={() => window.open(ctx.content)} style={style} className='aspect-square p-2 w-[150px] rounded-lg cursor-pointer flex flex-col items-center justify-center bg-neutral-100 word-break wrap-anywhere shadow-md'>
                                {!ctx.type.startsWith('image') && (
                                    <>
                                        <File />
                                        <p className='text-xs text-center'>{filename}</p>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default MessageBubble