import type { Subscription } from "./subscription"

export type User = {
    id: string
    email: string
    googleId: string
    avatar: string
    name: string
    registeredRegion: string
    roles: {
        id: string
        name: string
    }[]
    subscriptions: Subscription[]
    quotaUsed: {
        itemId: string
        _count: {
            _all: number
        }
    }[]
}

