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

    const config = await tx.query.storeConfig.findFirst();
    if (!config) throw new Error("Store config not found");
    const { shippingFee, customsFee, freeShippingThreshold } = config;
    const subTotal = Number(totalAmount) + Number(customsFee);

    let grandTotal: number;
    let isShippingFree: boolean;

    if(subTotal >= Number(freeShippingThreshold)) {
        grandTotal = Number(totalAmount) + Number(customsFee)
        isShippingFree = true;
    } else{
        grandTotal = Number(totalAmount) + Number(shippingFee) + Number(customsFee)
        isShippingFree = false;
    }

    const [updatedCart] = await tx
        .update(cart)
        .set({
            totalAmount: totalAmount.toFixed(2),
            grandTotal: grandTotal.toFixed(2),
        })
        .where(eq(cart.id, cartId))
        .returning()

    return {...updatedCart, isShippingFree};
}