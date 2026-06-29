import type { db } from "@/db"
import {getReturnHistory} from "@/actions/returns/getReturnHistory";

// Тип результата запроса возвратопригодных заказов — выводим из формы запроса,
// НЕ из самой server-функции (иначе круговая зависимость).
type OrdersQuery = ReturnType<typeof db.query.order.findMany<{
    with: {
        items: {
            with: {
                product: { with: { images: true } }
                returnItems: { with: { request: true } }
            }
        }
    }
}>>

export type ReturnableOrder = Awaited<OrdersQuery>[number]
export type ReturnableItem = ReturnableOrder["items"][number]

export type BlockedReason = "in_progress" | "refunded" | "rejected" | null

export type ItemReturnState = {
    purchased: number      // куплено единиц
    locked: number         // занято блокирующими возвратами
    returnable: number     // ещё можно вернуть
    isReturnable: boolean
    blockedReason: BlockedReason // почему нельзя (для бейджа), если returnable === 0
}

export type ReturnHistoryOrder = Awaited<ReturnType<typeof getReturnHistory>>[number]
export type ReturnHistoryItem = ReturnHistoryOrder["items"][number]
