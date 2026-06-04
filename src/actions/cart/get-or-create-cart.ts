import MergeCart from "@/actions/cart/cart-merge"
import { hashCartToken, makeCartToken } from "@/actions/cart/make-cart-token"
import { cart } from "@/db/schema"
import { CartItem, DbTransaction } from "@/types/cart"

export type CartCookieAction =
    | { type: "set"; token: string }
    | { type: "clear" }
    | { type: "none" }

// Для гостя — просто insert, конфликт невозможен (32 байта энтропии)
async function createGuestCart(tx: DbTransaction, tokenHash: string) {
    const [createdCart] = await tx
        .insert(cart)
        .values({
            userId: null,
            token: tokenHash,
            totalAmount: "0",
        })
        .returning()

    return {
        ...createdCart,
        items: [] as CartItem[],
    }
}

// Для юзера — атомарный upsert, защита от race condition
async function getOrCreateUserCart(tx: DbTransaction, userId: string) {
    const [inserted] = await tx
        .insert(cart)
        .values({
            userId,
            totalAmount: "0",
        })
        .onConflictDoNothing({ target: cart.userId })
        .returning()

    if (inserted) {
        return { ...inserted, items: [] as CartItem[] }
    }

    const existing = await tx.query.cart.findFirst({
        where: (c, { eq }) => eq(c.userId, userId),
        with: { items: true },
    })

    if (!existing) {
        throw new Error("Cart not found after conflict")
    }

    return existing
}

export async function GetOrCreateCart(opts: {
    userId: string | null
    cookieToken: string | null
    tx: DbTransaction
}) {
    const { userId, cookieToken, tx } = opts

    const cookieTokenHash = cookieToken ? hashCartToken(cookieToken) : null

    if (userId && cookieToken) {
        const mergedCart = await MergeCart({ userId, cookieToken, tx })

        if (!mergedCart) {
            throw new Error("Failed to merge carts")
        }

        return {
            cart: mergedCart,
            cookie: { type: "clear" } satisfies CartCookieAction,
        }
    }

    if (userId) {
        const userCart = await getOrCreateUserCart(tx, userId)
        return {
            cart: userCart,
            cookie: { type: "none" } satisfies CartCookieAction,
        }
    }

    if (cookieTokenHash) {
        const guestCart = await tx.query.cart.findFirst({
            where: (c, { eq }) => eq(c.token, cookieTokenHash),
            with: { items: true },
        })

        if (guestCart) {
            return {
                cart: guestCart,
                cookie: { type: "none" } satisfies CartCookieAction,
            }
        }
    }

    const token = makeCartToken()
    const tokenHash = hashCartToken(token)
    const guestCart = await createGuestCart(tx, tokenHash)

    return {
        cart: guestCart,
        cookie: { type: "set", token } satisfies CartCookieAction,
    }
}