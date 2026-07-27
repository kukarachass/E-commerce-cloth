import type { returnItemStatusEnum } from "@/db/schema";

export type ReturnItemStatus = (typeof returnItemStatusEnum.enumValues)[number];

/** Финальные статусы — по ним решение принято, менять нельзя */
export const FINAL_STATUSES: ReturnItemStatus[] = [
    "refunded",
    "rejected",
    "cancelled",
];

export const ITEM_TRANSITIONS: Record<ReturnItemStatus, ReturnItemStatus[]> = {
    requested: ["approved", "rejected"],
    approved: ["refunded", "rejected"],
    refunded: [],
    rejected: [],
    cancelled: [],
};

export const ITEM_LABELS: Record<ReturnItemStatus, string> = {
    requested: "Ожидает решения",
    approved: "Одобрено",
    refunded: "Деньги возвращены",
    rejected: "Отклонено",
    cancelled: "Отменено клиентом",
};

export const REASON_LABELS: Record<string, string> = {
    size: "Не тот размер",
    fit: "Не подошла посадка",
    changed_mind: "Передумал",
    defective: "Брак",
    wrong_item: "Прислали не то",
    not_as_described: "Не соответствует описанию",
};

export function canChangeItem(
    from: ReturnItemStatus,
    to: ReturnItemStatus,
): { allowed: boolean; reason?: string } {
    if (FINAL_STATUSES.includes(from)) {
        return { allowed: false, reason: "По этой позиции решение уже принято" };
    }
    if (!ITEM_TRANSITIONS[from].includes(to)) {
        return { allowed: false, reason: "Недопустимый переход" };
    }
    return { allowed: true };
}

/** Заявка закрыта, если по всем позициям есть финальное решение */
export function computeRequestStatus(
    items: { status: ReturnItemStatus }[],
): "open" | "closed" {
    return items.every((i) => FINAL_STATUSES.includes(i.status))
        ? "closed"
        : "open";
}

/** Сумма к возврату в ЦЕНТАХ. price у тебя decimal в евро — переводим */
export function refundableCents(
    items: { status: ReturnItemStatus; price: string; quantity: number }[],
): number {
    return items
        .filter((i) => i.status === "approved")
        .reduce((sum, i) => sum + Math.round(Number(i.price) * 100) * i.quantity, 0);
}