import { cart, cartItem, productSize } from "@/db/schema"
import { eq } from "drizzle-orm"
import { hashCartToken } from "@/actions/cart/make-cart-token"
import { DbTransaction } from "@/types/cart"

export default async function MergeCart(opts: {
    userId: string
    cookieToken: string
    tx: DbTransaction
}) {
    const { userId, cookieToken, tx } = opts
    const cookieTokenHash = hashCartToken(cookieToken)

    const guestCart = await tx.query.cart.findFirst({
        where: (cart, { eq }) => eq(cart.token, cookieTokenHash),
        with: { items: true },
    })

    const userCart = await tx.query.cart.findFirst({
        where: (cart, { eq }) => eq(cart.userId, userId),
        with: { items: true },
    })

    // Нет ни гостевой ни юзерской — создаём атомарно
    if (!guestCart && !userCart) {
        const [inserted] = await tx
            .insert(cart)
            .values({ userId, totalAmount: "0" })
            .onConflictDoNothing({ target: cart.userId })
            .returning()

        if (inserted) {
            return { ...inserted, items: [] }
        }

        // Конфликт — параллельный запрос создал корзину
        const existing = await tx.query.cart.findFirst({
            where: (c, { eq }) => eq(c.userId, userId),
            with: { items: true },
        })

        if (!existing) throw new Error("Cart not found after conflict")
        return existing
    }

    // Гостевой нет — у юзера уже есть корзина, просто возвращаем
    if (!guestCart) {
        return userCart!
    }

    // Юзерской нет — назначаем гостевую корзину юзеру
    if (!userCart) {
        try {
            const [updated] = await tx
                .update(cart)
                .set({ userId, token: null })
                .where(eq(cart.id, guestCart.id))
                .returning()

            return { ...updated, items: guestCart.items }
        } catch {
            // unique constraint на userId сработал — берём существующую
            const existing = await tx.query.cart.findFirst({
                where: (c, { eq }) => eq(c.userId, userId),
                with: { items: true },
            })

            if (!existing) throw new Error("Cart not found after conflict in merge")
            return existing
        }
    }

    // Обе корзины есть — мержим items из гостевой в юзерскую
    for (const item of guestCart.items) {
        const existing = await tx.query.cartItem.findFirst({
            where: (cartItem, { eq, and }) => and(
                eq(cartItem.cartId, userCart.id),
                eq(cartItem.productSizeId, item.productSizeId),
            ),
        })

        const [size] = await tx
            .select()
            .from(productSize)
            .where(eq(productSize.id, item.productSizeId))
            .for("update")
            .limit(1)

        if (!size) {
            // Размер удалён пока товар лежал в гостевой корзине
            continue
        }

        const mergedQuantity = existing
            ? existing.quantity + item.quantity
            : item.quantity

        const finalQuantity = Math.min(mergedQuantity, size.stockAmount)

        if (finalQuantity <= 0) {
            continue
        }

        if (existing) {
            await tx
                .update(cartItem)
                .set({ quantity: finalQuantity })
                .where(eq(cartItem.id, existing.id))
        } else {
            await tx.insert(cartItem).values({
                cartId: userCart.id,
                productId: item.productId,
                productSizeId: item.productSizeId,
                quantity: finalQuantity,
                priceAtAddition: item.priceAtAddition,
            })
        }
    }

    // Удаляем гостевую корзину
    await tx.delete(cartItem).where(eq(cartItem.cartId, guestCart.id))
    await tx.delete(cart).where(eq(cart.id, guestCart.id))

    const mergedCart = await tx.query.cart.findFirst({
        where: (cart, { eq }) => eq(cart.id, userCart.id),
        with: { items: true },
    })

    if (!mergedCart) throw new Error("Merged cart not found")

    return mergedCart
}