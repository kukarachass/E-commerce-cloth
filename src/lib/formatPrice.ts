
export const formatPrice = (price: number) =>
    new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
    }).format(price)