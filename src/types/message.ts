export const MESSAGE_OUTGOING = 'outgoing' as const
export const MESSAGE_INCOMING = 'incoming' as const
export type MessageDirection = typeof MESSAGE_OUTGOING | typeof MESSAGE_INCOMING

export type Message = {
    id: string
    content: string
    chatId: string
    replyToId?: string
    context?: Context[]
    direction: MessageDirection
    createdAt: string
    updatedAt: string
}

export type Context = {
    type: string
    content: string
}