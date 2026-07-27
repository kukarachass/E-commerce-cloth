"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { changeFulfillmentStatus } from "@/lib/admin/actions/orderStatus";
import { TRANSITION_LABELS } from "@/lib/admin/orders/transitions";
import type { OrderFulfillmentStatus } from "@/types/IOrder";

const DANGER: OrderFulfillmentStatus[] = ["cancelled", "returned"];

export default function OrderStatusActions({
                                               orderId,
                                               actions,
                                           }: {
    orderId: string;
    actions: OrderFulfillmentStatus[];
}) {
    const [pending, startTransition] = useTransition();

    if (actions.length === 0) {
        return (
            <p className="text-sm text-gray-400">
                Заказ в финальном статусе — действий нет
            </p>
        );
    }

    const run = (to: OrderFulfillmentStatus) => {
        if (DANGER.includes(to)) {
            const ok = confirm(
                to === "cancelled"
                    ? "Отменить заказ? Товары вернутся на склад."
                    : "Оформить возврат? Товары вернутся на склад.",
            );
            if (!ok) return;
        }

        startTransition(async () => {
            const res = await changeFulfillmentStatus(orderId, to);
            if (res.ok) toast.success(res.message ?? "Готово");
            else toast.error(res.message ?? "Не удалось");
        });
    };

    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((to) => (
                <button
                    key={to}
                    disabled={pending}
                    onClick={() => run(to)}
                    className={
                        "px-4 py-2 rounded-md text-sm disabled:opacity-50 " +
                        (DANGER.includes(to)
                            ? "border border-red-300 text-red-600 hover:bg-red-50"
                            : "bg-black text-white")
                    }
                >
                    {TRANSITION_LABELS[to]}
                </button>
            ))}
        </div>
    );
}