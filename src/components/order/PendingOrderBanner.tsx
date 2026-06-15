"use client"

import { useCancelCheckout } from "@/hooks/checkout/useCancelCheckout"
import { useResumeCheckout } from "@/hooks/checkout/useResumeCheckout"
import useGetActivePendingOrder from "@/hooks/checkout/useGetActivePendingOrder"

export default function PendingOrderBanner() {
    const { data: order } = useGetActivePendingOrder()
    const resume = useResumeCheckout()
    const cancel = useCancelCheckout()

    if (!order) return null

    const busy = resume.isPending || cancel.isPending

    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 border-l-[2.5px] border-l-amber-500">
            <div className="flex items-center gap-3 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[13px] font-medium text-neutral-900">
                        Unfinished order
                    </span>
                    <span className="text-[12px] text-neutral-500 truncate">
                        €{order.totalAmount} · #{order.id.slice(0, 8).toUpperCase()} is waiting for payment
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={() => cancel.mutate(order.id)}
                    disabled={busy}
                    className="px-3 py-1.5 text-[12px] font-medium text-neutral-500 rounded-lg hover:bg-amber-100 hover:text-neutral-700 transition-colors duration-100 disabled:opacity-50"
                >
                    {cancel.isPending ? "Cancelling…" : "Cancel"}
                </button>
                <button
                    onClick={() => resume.mutate(order.id)}
                    disabled={busy}
                    className="px-3.5 py-1.5 text-[12px] font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-700 transition-colors duration-100 disabled:opacity-50"
                >
                    {resume.isPending ? "Redirecting…" : "Complete payment"}
                </button>
            </div>
        </div>
    )
}