import type { returnItemStatusEnum } from "@/db/schema"

export type ReturnItemStatus = (typeof returnItemStatusEnum.enumValues)[number]

// Статусы, при которых единица СЧИТАЕТСЯ занятой (нельзя запросить повторно):
//  - активные (requested/approved) — уже в процессе
//  - refunded — успешно вернули
//  - rejected — ВЕРДИКТ магазина «нельзя», блокирует навсегда
// "cancelled" сюда НЕ входит → покупатель отменил сам → единица снова свободна
export const BLOCKING_RETURN_STATUSES: ReadonlySet<ReturnItemStatus> = new Set([
    "requested",
    "approved",
    "refunded",
    "rejected",
])

export function isBlocking(status: ReturnItemStatus): boolean {
    return BLOCKING_RETURN_STATUSES.has(status)
}