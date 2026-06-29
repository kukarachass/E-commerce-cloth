"use server"

import { and, eq, inArray } from "drizzle-orm"
import { db } from "@/db"
import { order, orderItem, returnItem, returnRequest } from "@/db/schema"
import { getServerSession } from "@/lib/get-session"
import { isBlocking, type ReturnItemStatus } from "@/lib/returns/status"
import type { ReturnReason } from "@/lib/returns/reasons"

type CreateReturnInput = {
    orderId: string
    items: { orderItemId: string; quantity: number; reason: ReturnReason }[]
}

type CreateReturnResult =
    | { ok: true; returnId: string }
    | { ok: false; error: "EMPTY" | "NOT_ELIGIBLE" | "INVALID_ITEMS" | "UNAUTHORIZED" | "UNKNOWN" }

const RETURN_WINDOW_DAYS = 30

export async function createReturn(input: CreateReturnInput): Promise<CreateReturnResult> {
    // 1. личность
    const session = await getServerSession()
    if (!session?.user.id) return { ok: false, error: "UNAUTHORIZED" }
    if (input.items.length === 0) return { ok: false, error: "EMPTY" }

    // 2. заказ принадлежит юзеру?
    const ord = await db.query.order.findFirst({
        where: and(eq(order.id, input.orderId), eq(order.userId, session.user.id)),
    })
    if (!ord) return { ok: false, error: "UNKNOWN" }

    // 3. право на возврат заказа
    const windowStart = new Date()
    windowStart.setDate(windowStart.getDate() - RETURN_WINDOW_DAYS)
    const eligible =
        ord.paymentStatus === "paid" &&
        ord.fulfillmentStatus === "delivered" &&
        ord.createdAt >= windowStart
    if (!eligible) return { ok: false, error: "NOT_ELIGIBLE" }

    // 4. достаём НАСТОЯЩИЕ позиции заказа + их прошлые возвраты
    const requestedIds = input.items.map((i) => i.orderItemId)
    const orderItems = await db.query.orderItem.findMany({
        where: and(eq(orderItem.orderId, ord.id), inArray(orderItem.id, requestedIds)),
        with: { returnItems: true }, // нужен только status каждого прошлого возврата
    })
    if (orderItems.length !== input.items.length) return { ok: false, error: "INVALID_ITEMS" }

    const itemsById = new Map(orderItems.map((oi) => [oi.id, oi]))

    // 5. валидация + расчёт по позициям
    let refundCents = 0
    const itemsToInsert: { orderItemId: string; quantity: number; reason: ReturnReason; price: string }[] = []

    // oi - то что было в заказе
    // ri - то что хотят вернуть

    for (const line of input.items) {
        const oi = itemsById.get(line.orderItemId)
        if (!oi) return { ok: false, error: "INVALID_ITEMS" }

        if (!Number.isInteger(line.quantity) || line.quantity < 1) {
            return { ok: false, error: "INVALID_ITEMS" }
        }

        // в заказе условно 3 позиции, oi = 3
        // хотим вернуть 2, ri = 2
        // остаток = куплено − занято блокирующими (rejected тоже блокирует; cancelled — нет)
        const locked = oi.returnItems.reduce((sum, ri) => {
            return isBlocking(ri.status as ReturnItemStatus) ? sum + ri.quantity : sum
        }, 0)
        const remaining = oi.quantity - locked
         // 2 - 0 = 2
        if (line.quantity > remaining) return { ok: false, error: "INVALID_ITEMS" }

        refundCents += Math.round(Number(oi.price) * 100) * line.quantity
        itemsToInsert.push({
            orderItemId: oi.id,
            quantity: line.quantity,
            reason: line.reason,
            price: oi.price,
        })
    }

    // 6. транзакция: конверт + позиции (все позиции стартуют в "requested")
    try {
        const returnId = await db.transaction(async (tx) => {
            const [created] = await tx.insert(returnRequest).values({
                orderId: ord.id,
                userId: session.user.id,
                status: "open",
                refundedAmount: 0,
                currency: "eur",
            }).returning({ id: returnRequest.id })

            await tx.insert(returnItem).values(
                itemsToInsert.map((it) => ({
                    returnRequestId: created.id,
                    orderItemId: it.orderItemId,
                    status: "requested" as const,
                    quantity: it.quantity,
                    reason: it.reason,
                    price: it.price,
                    restocked: false,
                })),
            )

            return created.id
        })

        return { ok: true, returnId }
    } catch (e) {
        console.error("createReturn failed", e)
        return { ok: false, error: "UNKNOWN" }
    }
}