export const queryKeys = {
    cart: ["cart"] as const,
    product: (slug: string) => ["product", slug] as const,
    order: ["order"] as const,
}