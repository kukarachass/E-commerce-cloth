"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { ReturnItemStatus } from "@/lib/admin/returns/rules";
import {decideReturnItem} from "@/lib/admin/actions/return-actions/decideReturnItem";
import {restockReturnItem} from "@/lib/admin/actions/return-actions/restockReturnItem";
import {refundReturn} from "@/lib/admin/actions/return-actions/refundReturn";

/* ── Кнопки решения по одной позиции ─────────────────────── */
export function ItemDecision({
                                 itemId,
                                 status,
                                 restocked,
                             }: {
    itemId: string;
    status: ReturnItemStatus;
    restocked: boolean;
}) {
    const [pending, start] = useTransition();

    const run = (fn: () => Promise<{ ok: boolean; message?: string }>) =>
        start(async () => {
            const res = await fn();
            res.ok
                ? toast.success(res.message ?? "Готово")
                : toast.error(res.message ?? "Не удалось");
        });

    const decide = (to: ReturnItemStatus) => {
        if (to === "rejected" && !confirm("Отклонить возврат? Это решение окончательное.")) return;
        run(() => decideReturnItem(itemId, to));
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {status === "requested" && (
                <>
                    <button
                        disabled={pending}
                        onClick={() => decide("approved")}
                        className="px-3 py-1.5 text-xs bg-black text-white rounded-md disabled:opacity-50"
                    >
                        Одобрить
                    </button>
                    <button
                        disabled={pending}
                        onClick={() => decide("rejected")}
                        className="px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
                    >
                        Отклонить
                    </button>
                </>
            )}

            {status === "approved" && !restocked && (
                <button
                    disabled={pending}
                    onClick={() => run(() => restockReturnItem(itemId))}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    Принять на склад
                </button>
            )}

            {status === "approved" && restocked && (
                <span className="text-xs text-green-600">✓ на складе</span>
            )}
        </div>
    );
}

/* ── Кнопка возврата денег по всей заявке ────────────────── */
export function RefundButton({
                                 requestId,
                                 amountCents,
                                 blockedReason,
                             }: {
    requestId: string;
    amountCents: number;
    blockedReason?: string;
}) {
    const [pending, start] = useTransition();

    if (blockedReason) {
        return <p className="text-sm text-gray-400">{blockedReason}</p>;
    }

    const run = () => {
        if (
            !confirm(
                `Вернуть €${(amountCents / 100).toFixed(2)} через Stripe? Отменить будет нельзя.`,
            )
        )
            return;

        start(async () => {
            const res = await refundReturn(requestId);
            res.ok
                ? toast.success(res.message ?? "Возврат выполнен")
                : toast.error(res.message ?? "Не удалось");
        });
    };

    return (
        <button
            disabled={pending}
            onClick={run}
            className="px-4 py-2 bg-black text-white rounded-md text-sm disabled:opacity-50"
        >
            {pending ? "Возвращаю…" : `Вернуть €${(amountCents / 100).toFixed(2)}`}
        </button>
    );
}