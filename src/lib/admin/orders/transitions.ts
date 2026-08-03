import type {
    OrderFulfillmentStatus,
    OrderPaymentStatus,
} from "@/types/IOrder";

/**
 * Куда можно перейти из каждого статуса доставки.
 * Пустой массив = финальное состояние, дальше ходу нет.
 *
 * Это ЕДИНСТВЕННОЕ место, где описаны правила.
 * И кнопки в UI, и проверка на сервере читают отсюда же —
 * поэтому они не могут разойтись.
 */
export const FULFILLMENT_TRANSITIONS: Record<OrderFulfillmentStatus, OrderFulfillmentStatus[]> =
    {
        unfulfilled: ["processing", "cancelled"],
        processing: ["shipped", "cancelled"],
        shipped: ["delivered", "returned"],
        delivered: ["returned"],
        cancelled: [],
        returned: [],
    };

/** Действия, требующие оплаченного заказа */
const REQUIRES_PAID: OrderFulfillmentStatus[] = ["processing", "shipped", "delivered"];

/** Действия, возвращающие товар на склад */
export const RESTOCK_ON: OrderFulfillmentStatus[] = ["cancelled", "returned"];

export type TransitionCheck =
    | { allowed: true }
    | { allowed: false; reason: string };

export function canTransition(
    from: OrderFulfillmentStatus,
    to: OrderFulfillmentStatus,
    paymentStatus: OrderPaymentStatus,
): TransitionCheck {
    if (from === to) {
        return { allowed: false, reason: "Заказ уже в этом статусе" };
    }

    if (!FULFILLMENT_TRANSITIONS[from].includes(to)) {
        return {
            allowed: false,
            reason: `Нельзя перейти из «${FULFILLMENT_LABELS[from]}» в «${FULFILLMENT_LABELS[to]}»`,
        };
    }

    if (REQUIRES_PAID.includes(to) && paymentStatus !== "paid") {
        return { allowed: false, reason: "Заказ не оплачен" };
    }

    return { allowed: true };
}

/** Список доступных действий для текущего состояния — для отрисовки кнопок */
export function availableTransitions(
    from: OrderFulfillmentStatus,
    paymentStatus: OrderPaymentStatus,
) {
    return FULFILLMENT_TRANSITIONS[from].filter(
        (to) => canTransition(from, to, paymentStatus).allowed,
    );
}

export const FULFILLMENT_LABELS: Record<OrderFulfillmentStatus, string> = {
    unfulfilled: "Не собран",
    processing: "Собирается",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён",
    returned: "Возвращён",
};

export const TRANSITION_LABELS: Record<OrderFulfillmentStatus, string> = {
    unfulfilled: "Вернуть в «не собран»",
    processing: "Взять в сборку",
    shipped: "Отметить отправленным",
    delivered: "Отметить доставленным",
    cancelled: "Отменить заказ",
    returned: "Оформить возврат",
};