export type Package = {
    id: string
    code: string
    name: string
    prices: Price[]
    packageItems: PackageItem[]
}

export type Price = {
    region: string
    total: number
    detail: PriceDetail[]
}

export type PriceDetail = {
    name: string
    type: string
    category: string
    amount: number
}

export type PackageItem = {
    id: string
    item: Item
    max: number
}

export type Item = {
    id: string
    name: string
    isAi: boolean
}