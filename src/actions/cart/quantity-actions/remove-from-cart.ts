import {GetOrCreateCart} from "@/actions/cart/get-or-create-cart";
import {db} from "@/db";
import {and, eq} from "drizzle-orm";
import {cartItem} from "@/db/schema";
import updateCartTotalAmount from "@/actions/cart/update-total-amount";
import {ApplyCartCookieAction} from "@/actions/cart/apply-cart-cookies";
import {cookies} from "next/headers";
import {CART_COOKIE_NAME} from "@/lib/cart-constants";

interface RemoveCartItemProps {
    userId: string | null;
    cartItemId: string;
}

export async function RemoveCartItem({
                                         userId,
                                         cartItemId,
                                     }: RemoveCartItemProps) {
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CART_COOKIE_NAME)?.value ?? null

    const result = await db.transaction(async (tx) => {

        const userCart = await GetOrCreateCart({userId, cookieToken, tx})

        await tx
            .delete(cartItem)
            .where(
                and(
                    eq(cartItem.id, cartItemId),
                    eq(cartItem.cartId, userCart.cart.id), // защита — нельзя удалить чужой item
                )
            )

        const updatedCart = await updateCartTotalAmount(tx, userCart.cart.id)
        return {cart: updatedCart, cookie: userCart.cookie}
    })

    await ApplyCartCookieAction(result.cookie)
    return result.cart
}