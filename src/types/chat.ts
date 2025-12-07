export const CHAT_AI = 'AI' as const
export const CHAT_HUMAN = 'Human' as const
export type ChatType = typeof CHAT_AI | typeof CHAT_HUMAN

export const CHAT_POSTER = '69001b5139c571b139e38920'
export const CHAT_LOGO = '69001ab239c571b139e3891f'
export type ChatCategory = typeof CHAT_POSTER | typeof CHAT_LOGO

export type Chat = {
    id: string
    title: string
    type: ChatType
    itemId: ChatCategory
    detail: Record<string, unknown>
    generations: Array<any>
    description: string
    createdAt: string
    updatedAt: string
}