import {DbTx} from "@/types/IDb";
import {IOrder} from "@/types/IOrder";
import {cartItem} from "@/db/schema";
import {eq} from "drizzle-orm";
import {cookies} from "next/headers";
import {CART_COOKIE_NAME} from "@/lib/cart-constants";
import {hashCartToken} from "@/actions/cart/make-cart-token";

interface CartCleanProps{
    tx: DbTx;
    ord: IOrder;
}

export async function cartClean({ tx, ord }: CartCleanProps) {
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CART_COOKIE_NAME)?.value ?? null
    const cookieTokenHash = cookieToken ? hashCartToken(cookieToken) : null
    const { userId } = ord;

    const userCart = userId
        ? await tx.query.cart.findFirst({
            where: (cart, { eq }) => eq(cart.userId, userId),
        })
        : cookieTokenHash
            ? await tx.query.cart.findFirst({
                where: (cart, { eq }) => eq(cart.token, cookieTokenHash),
            })
            : null;

    if (!userCart) throw new Error("cart not found");

    await tx.delete(cartItem).where(eq(cartItem.cartId, userCart.id));
}