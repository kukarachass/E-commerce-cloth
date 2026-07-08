import {Gender} from "@/hooks/useGender";

export const queryKeys = {
    cart: ["cart"] as const,
    product: (slug: string) => ["product", slug] as const,
    orders: ["orders"] as const,
    returnableOrders: ["returnableOrders"] as const,
    activePendingOrder: ["order", "active-pending"] as const,
    returnHistory: ["returnHistory"] as const,
    categories: ["categories"] as const,
    subCats: (gender: Gender, slug: string) => {
        return ['category', 'subcats', gender, slug] as const
    },
    parentCats: (gender: Gender) => {
        return ['parentCats', gender] as const
    },
    recommendations: (gender: Gender, productIds: string) => {
        return ['recommendations', gender, productIds] as const
    },
    cancelOrders: (orderId: string) => {
        return ['cancel-order', orderId] as const
    }
}