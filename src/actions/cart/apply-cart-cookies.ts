import {CartCookieAction} from "@/actions/cart/get-or-create-cart";
import {cookies} from "next/headers";
import {CART_COOKIE_NAME} from "@/lib/cart-constants";



export async function ApplyCartCookieAction(cookieAction: CartCookieAction) {
    const cookieStore = await cookies()

    if (cookieAction.type === "set") {
        cookieStore.set(CART_COOKIE_NAME, cookieAction.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        })
    }

    if (cookieAction.type === "clear") {
        cookieStore.delete(CART_COOKIE_NAME)
    }
}