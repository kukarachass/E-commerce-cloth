"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, PackageCheck, X } from "lucide-react";
import type { ReturnItemStatus } from "@/lib/admin/returns/rules";
import { decideReturnItem } from "@/lib/admin/actions/return-actions/decideReturnItem";
import { restockReturnItem } from "@/lib/admin/actions/return-actions/restockReturnItem";
import { refundReturn } from "@/lib/admin/actions/return-actions/refundReturn";
import Button from "@/app/(admin)/admin/_components/ui/Button";
import { euroFromCents } from "@/app/(admin)/admin/_lib/format";

type ActionResult = { ok: boolean; message?: string };

function useAction() {
    const [pending, start] = useTransition();

    const run = (fn: () => Promise<ActionResult>) =>
        start(async () => {
            const res = await fn();
            if (res.ok) toast.success(res.message ?? "Done");
            else toast.error(res.message ?? "Action failed");
        });

    return { pending, run };
}

/* ── решение по одной позиции ──────────────────────────────── */

export function ItemDecision({
    itemId,
    status,
    restocked,
}: {
    itemId: string;
    status: ReturnItemStatus;
    restocked: boolean;
}) {
    const { pending, run } = useAction();

    const decide = (to: ReturnItemStatus) => {
        if (
            to === "rejected" &&
            !confirm("Reject this item? The decision is final.")
        ) {
            return;
        }
        run(() => decideReturnItem(itemId, to));
    };

    if (status === "requested") {
        return (
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    variant="primary"
                    disabled={pending}
                    onClick={() => decide("approved")}
                >
                    <Check className="h-3.5 w-3.5" />
                    Approve
                </Button>
                <Button
                    size="sm"
                    variant="danger"
                    disabled={pending}
                    onClick={() => decide("rejected")}
                >
                    <X className="h-3.5 w-3.5" />
                    Reject
                </Button>
            </div>
        );
    }

    if (status === "approved" && !restocked) {
        return (
            <Button
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => run(() => restockReturnItem(itemId))}
            >
                <PackageCheck className="h-3.5 w-3.5" />
                Take back to stock
            </Button>
        );
    }

    if (status === "approved" && restocked) {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-positive">
                <PackageCheck className="h-3.5 w-3.5" />
                Back in stock
            </span>
        );
    }

    return null;
}

/* ── возврат денег по всей заявке ──────────────────────────── */

export function RefundButton({
    requestId,
    amountCents,
    blockedReason,
}: {
    requestId: string;
    amountCents: number;
    blockedReason?: string;
}) {
    const { pending, run } = useAction();

    if (blockedReason) {
        return (
            <p className="rounded-field bg-sunk px-3.5 py-2.5 text-xs text-ink-soft">
                {blockedReason}
            </p>
        );
    }

    const confirmAndRun = () => {
        if (
            !confirm(
                `Refund ${euroFromCents(amountCents)} through Stripe? This cannot be undone.`,
            )
        ) {
            return;
        }
        run(() => refundReturn(requestId));
    };

    return (
        <Button
            variant="accent"
            disabled={pending}
            onClick={confirmAndRun}
            className="w-full"
        >
            {pending ? "Refunding…" : `Refund ${euroFromCents(amountCents)}`}
        </Button>
    );
}
