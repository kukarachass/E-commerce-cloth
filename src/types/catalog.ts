import type { ProductWithDetails } from "@/types/product-details"

export type ProductsResult = {
    products: ProductWithDetails[]
    total: number
    page: number
    perPage: number
}