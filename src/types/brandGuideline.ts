export type BrandGuideline = {
    id: string
    userId: string
    latestId: string | null
    name: string
    type: string
    description: string
    advantage?: string
    contactEmail: string
    logos: {
        type: string
        color: string
        url: string
    }[]
    colorPalette: string[]
    contacts: {
        type: string
        value: string
    }[]
    references: string[]
    borderTemplates: string[]
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}