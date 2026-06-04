"use server"

import {CART_COOKIE_NAME, CART_MAX_QUANTITY_PER_ITEM} from "@/lib/cart-constants";
import {db} from "@/db";
import {GetOrCreateCart} from "@/actions/cart/get-or-create-cart";
import {cartItem, productSize} from "@/db/schema";
import {eq} from "drizzle-orm";
import updateCartTotalAmount from "@/actions/cart/update-total-amount";
import {ApplyCartCookieAction} from "@/actions/cart/apply-cart-cookies";
import {cookies} from "next/headers";

interface UpdateCartItemQuantityProps {
    userId: string | null
    cartItemId: string
    quantity: number
}

export async function SubtractFromCart({
                                                 userId,
                                                 cartItemId,
                                                 quantity,
                                             }: UpdateCartItemQuantityProps) {
    if (quantity <= 0 || quantity > CART_MAX_QUANTITY_PER_ITEM) {
        throw new Error(`Quantity must be between 1 and ${CART_MAX_QUANTITY_PER_ITEM}`)
    }

    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CART_COOKIE_NAME)?.value ?? null


    const result = await db.transaction(async (tx) => {
        const userCart = await GetOrCreateCart({ userId, cookieToken, tx })

        const existing = await tx.query.cartItem.findFirst({
            where: (ci, { eq, and }) => and(
                eq(ci.id, cartItemId),
                eq(ci.cartId, userCart.cart.id),
            ),
        })
        if (!existing) throw new Error("Cart item not found")

        const [size] = await tx
            .select()
            .from(productSize)
            .where(eq(productSize.id, existing.productSizeId))
            .for("update")
            .limit(1)

        if (!size || size.stockAmount < quantity) {
            throw new Error("Not enough stock")
        }

        await tx
            .update(cartItem)
            .set({ quantity })
            .where(eq(cartItem.id, cartItemId))

        const updatedCart = await updateCartTotalAmount(tx, userCart.cart.id)
        return { cart: updatedCart, cookie: userCart.cookie }
    })

    await ApplyCartCookieAction(result.cookie)
    return result.cart
}