"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { changeFulfillmentStatus } from "@/lib/admin/actions/orderStatus";
import type { OrderFulfillmentStatus } from "@/types/IOrder";
import Button from "@/app/(admin)/admin/_components/ui/Button";
import { TRANSITION_LABELS } from "@/app/(admin)/admin/_lib/labels";

/** Переходы, которые нельзя откатить — спрашиваем подтверждение */
const DANGER: OrderFulfillmentStatus[] = ["cancelled", "returned"];

const CONFIRM: Partial<Record<OrderFulfillmentStatus, string>> = {
    cancelled: "Cancel this order? Reserved stock goes back to inventory.",
    returned: "Register a return? Items go back to inventory.",
};

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
            <p className="text-sm text-ink-faint">
                This order reached a final state — no transitions left.
            </p>
        );
    }

    const run = (to: OrderFulfillmentStatus) => {
        const question = CONFIRM[to];
        if (question && !confirm(question)) return;

        startTransition(async () => {
            const res = await changeFulfillmentStatus(orderId, to);
            if (res.ok) toast.success(res.message ?? "Done");
            else toast.error(res.message ?? "Could not update the order");
        });
    };

    return (
        <div className="flex flex-wrap gap-2">
            {actions.map((to) => (
                <Button
                    key={to}
                    disabled={pending}
                    onClick={() => run(to)}
                    variant={DANGER.includes(to) ? "danger" : "primary"}
                    size="sm"
                >
                    {TRANSITION_LABELS[to]}
                </Button>
            ))}
        </div>
    );
}
