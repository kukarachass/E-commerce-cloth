import {db} from "@/db";
import {order, orderItem, productSize} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {DbTransaction} from "@/types/cart";

export async function releaseStockTx(tx: DbTransaction, orderId: string, terminalStatus: "failed" | "expired") {
    const [ord] = await tx.select().from(order).where(eq(order.id, orderId)).for("update")
    if (!ord) return
    if (ord.paymentStatus !== "pending") return

    const lines = await tx.select().from(orderItem).where(eq(orderItem.orderId, orderId))
    for (const line of lines) {
        const [ps] = await tx.select().from(productSize)
            .where(and(eq(productSize.productId, line.productId), eq(productSize.size, line.size)))
            .for("update")
        if (ps) {
            await tx.update(productSize)
                .set({ stockAmount: ps.stockAmount + line.quantity })
                .where(eq(productSize.id, ps.id))
        }
    }
    await tx.update(order).set({ paymentStatus: terminalStatus }).where(eq(order.id, orderId))
}

export async function releaseStock(orderId: string, terminalStatus: "failed" | "expired") {
    await db.transaction((tx) => releaseStockTx(tx, orderId, terminalStatus))
}