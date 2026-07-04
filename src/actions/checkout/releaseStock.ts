import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { order, orderItem, productSize } from "@/db/schema"
import { DbTx } from "@/types/IDb"

// работает в уже открытой транзакции (зовётся из вебхука с общим tx)
export async function releaseStockTx(tx: DbTx, orderId: string, terminalStatus: "failed" | "expired") {
    const [ord] = await tx.select().from(order).where(eq(order.id, orderId)).for("update")
    if (!ord) return
    if (ord.paymentStatus !== "pending") return // гард: не возвращаем по paid / повторно

    const lines = await tx.select().from(orderItem).where(eq(orderItem.orderId, orderId))
    for (const line of lines) {
        const [ps] = await tx.select().from(productSize)
            .where(and(
                eq(productSize.productId, line.productId),
                eq(productSize.id, line.productSizeId)))
            .for("update")
        if (ps) {
            await tx.update(productSize)
                .set({ stockAmount: ps.stockAmount + line.quantity })
                .where(eq(productSize.id, ps.id))
        }
    }

    await tx.update(order).set({ paymentStatus: terminalStatus }).where(eq(order.id, orderId))
}

// открывает свою транзакцию (зовётся из catch в createCheckout)
export async function releaseStock(orderId: string, terminalStatus: "failed" | "expired") {
    await db.transaction((tx) => releaseStockTx(tx, orderId, terminalStatus))
}