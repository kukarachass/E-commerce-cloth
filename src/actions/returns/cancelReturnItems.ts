"use server"

import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { returnItem, returnRequest } from "@/db/schema"
import { getServerSession } from "@/lib/get-session"

type CancelResult = { ok: true } | { ok: false; error: "FORBIDDEN" | "NOT_FOUND" | "UNKNOWN" }

// Покупатель может отменить ТОЛЬКО свои позиции и ТОЛЬКО пока они "requested".
// approved/refunded/rejected отменить нельзя — решение уже принято.
export async function cancelReturnItems(returnItemIds: string[]): Promise<CancelResult> {
    const session = await getServerSession()
    if (!session?.user.id) return { ok: false, error: "FORBIDDEN" }
    if (returnItemIds.length === 0) return { ok: false, error: "NOT_FOUND" }

    try {
        await db.transaction(async (tx) => {
            // тянем позиции вместе с заявкой — проверить владельца
            const items = await tx.query.returnItem.findMany({
                where: inArray(returnItem.id, returnItemIds),
                with: { request: true },
            })

            for (const it of items) {
                if (it.request.userId !== session.user.id) continue // чужое — пропускаем
                if (it.status !== "requested") continue               // уже решено — нельзя
                await tx.update(returnItem).set({ status: "cancelled" }).where(eq(returnItem.id, it.id))
            }

            // если в заявке не осталось активных позиций — закрываем конверт
            const reqIds = [...new Set(items.map((i) => i.returnRequestId))]
            for (const reqId of reqIds) {
                const active = await tx.query.returnItem.findMany({
                    where: and(
                        eq(returnItem.returnRequestId, reqId),
                        inArray(returnItem.status, ["requested", "approved"]),
                    ),
                })
                if (active.length === 0) {
                    await tx.update(returnRequest).set({ status: "closed" }).where(eq(returnRequest.id, reqId))
                }
            }
        })
        return { ok: true }
    } catch (e) {
        console.error("cancelReturnItems failed", e)
        return { ok: false, error: "UNKNOWN" }
    }
}