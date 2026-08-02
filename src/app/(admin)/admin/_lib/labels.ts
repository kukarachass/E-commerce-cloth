import type {
    OrderFulfillmentStatus,
    OrderPaymentStatus,
} from "@/types/IOrder";
import type { ReturnItemStatus } from "@/lib/admin/returns/rules";
import type { Tone } from "@/app/(admin)/admin/_components/ui/Badge";

/**
 * Английские подписи для админки.
 *
 * Серверные словари (lib/admin/orders/transitions.ts, lib/admin/returns/rules.ts)
 * не трогаем — они участвуют в сообщениях валидации. Здесь живёт только
 * то, что видит глазами администратор.
 */

export const PAYMENT_LABELS: Record<OrderPaymentStatus, string> = {
    pending: "Awaiting payment",
    paid: "Paid",
    failed: "Payment failed",
    expired: "Expired",
    refunded: "Refunded",
    partially_refunded: "Partly refunded",
};

export const PAYMENT_TONES: Record<OrderPaymentStatus, Tone> = {
    pending: "caution",
    paid: "positive",
    failed: "critical",
    expired: "neutral",
    refunded: "info",
    partially_refunded: "info",
};

export const FULFILLMENT_LABELS: Record<OrderFulfillmentStatus, string> = {
    unfulfilled: "Not packed",
    processing: "Packing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    returned: "Returned",
};

export const FULFILLMENT_TONES: Record<OrderFulfillmentStatus, Tone> = {
    unfulfilled: "caution",
    processing: "info",
    shipped: "dark",
    delivered: "positive",
    cancelled: "critical",
    returned: "neutral",
};

/** Подписи кнопок перехода — глагол, а не название статуса */
export const TRANSITION_LABELS: Record<OrderFulfillmentStatus, string> = {
    unfulfilled: "Move back to queue",
    processing: "Start packing",
    shipped: "Mark shipped",
    delivered: "Mark delivered",
    cancelled: "Cancel order",
    returned: "Register return",
};

/** Порядок шагов для таймлайна заказа */
export const FULFILLMENT_FLOW: OrderFulfillmentStatus[] = [
    "unfulfilled",
    "processing",
    "shipped",
    "delivered",
];

export const RETURN_ITEM_LABELS: Record<ReturnItemStatus, string> = {
    requested: "Awaiting review",
    approved: "Approved",
    refunded: "Refunded",
    rejected: "Rejected",
    cancelled: "Cancelled by customer",
};

export const RETURN_ITEM_TONES: Record<ReturnItemStatus, Tone> = {
    requested: "caution",
    approved: "info",
    refunded: "positive",
    rejected: "critical",
    cancelled: "neutral",
};

export const RETURN_REASON_LABELS: Record<string, string> = {
    size: "Wrong size",
    fit: "Bad fit",
    changed_mind: "Changed mind",
    defective: "Defective",
    wrong_item: "Wrong item sent",
    not_as_described: "Not as described",
};

export const RETURN_STATUS_LABELS = {
    open: "Open",
    closed: "Closed",
} as const;

export const GENDER_LABELS: Record<string, string> = {
    women: "Women",
    men: "Men",
    unisex: "Unisex",
};

export const AUDIT_ACTION_TONES: Record<string, Tone> = {
    create: "positive",
    update: "info",
    delete: "critical",
    restore: "caution",
    login: "neutral",
    export: "accent",
};

export const ROLE_LABELS: Record<string, string> = {
    admin: "Administrator",
    customer: "Customer",
};

/** Человеческое имя поля в диффе аудита */
export function humanizeKey(key: string) {
    return key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/^./, (c) => c.toUpperCase());
}
