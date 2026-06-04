import { eq } from "drizzle-orm"
import { DbTransaction } from "@/types/cart"
import { cart } from "@/db/schema"

export default async function updateCartTotalAmount(
    tx: DbTransaction,
    cartId: string,
) {
    const userCart = await tx.query.cart.findFirst({
        where: (cart, { eq }) => eq(cart.id, cartId),
        with: {
            items: true,
        },
    })

    if (!userCart) {
        throw new Error("Cart not found")
    }

    const totalAmount = userCart.items.reduce((acc, item) => {
        const price = Number(item.priceAtAddition);
        return acc + price * item.quantity
    }, 0)

    const [updatedCart] = await tx
        .update(cart)
        .set({
            totalAmount: totalAmount.toFixed(2),
        })
        .where(eq(cart.id, cartId))
        .returning()

    return updatedCart
}