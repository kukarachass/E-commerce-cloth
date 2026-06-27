"use server"

import {getServerSession} from "@/lib/get-session";
import {db} from "@/db";

type CreateReturnInput = {
    orderId: string
    items: { orderItemId: string; quantity: number; reason: string }[]
}

type CreateReturnResult =
    | { ok: true; returnId: string }
    | { ok: false; error: "EMPTY" | "NOT_ELIGIBLE" | "UNKNOWN" | "UNAUTHORIZED" }

export async function createReturn(input: CreateReturnInput): Promise<CreateReturnResult> {
    // 1. сессия + проверка, что заказ принадлежит юзеру и в окне возврата
    const session = await getServerSession()
    if(!session) return { ok: false, error: "UNAUTHORIZED"};

    const order = await db.query.order.findFirst({
        where: (order, { eq, and }) => and(
            eq(order.id, input.orderId),
            eq(order.userId, session.user.id)
        )
    })
    if(!order) return { ok: false, error: "UNKNOWN"};

    // 2. транзакция: insert return + returnItem[], проверка quantity ≤ заказанного
    // 3. вернуть { ok: true, returnId }
    // структурированные ошибки, не throw — как везде в проекте
    return { ok: true, returnId: "placeholder" }
}