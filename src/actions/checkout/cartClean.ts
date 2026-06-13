import { eq } from "drizzle-orm"
import { cartItem } from "@/db/schema"
import { DbTx } from "@/types/IDb"

export async function cartClean(tx: DbTx, cartId: string | null) {
    if (!cartId) return                 // нет корзины — нечего чистить, не падаем
    await tx.delete(cartItem).where(eq(cartItem.cartId, cartId))
}