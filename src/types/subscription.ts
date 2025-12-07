import type { Package } from "./package"

export type Subscription = {
    id: string
    packageId: string
    package?: Package
    startDate: string
    endDate: string
}