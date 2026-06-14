export const queryKeys = {
    cart: ["cart"] as const,
    product: (slug: string) => ["product", slug] as const,
    orders: ["orders"] as const,
    activePendingOrder: ["order", "active-pending"] as const, // один pending → useGetActivePendingOrder

}