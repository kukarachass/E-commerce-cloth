"use client"


import {useCancelCheckout} from "@/hooks/checkout/useCancelCheckout";
import {useResumeCheckout} from "@/hooks/checkout/useResumeCheckout";
import useGetActivePendingOrder from "@/hooks/checkout/useGetActivePendingOrder";

export default function PendingOrderBanner() {
    const { data: order } = useGetActivePendingOrder()
    const resume = useResumeCheckout()
    const cancel = useCancelCheckout()

    if (!order) return null
    console.log("order", order)
    const busy = resume.isPending || cancel.isPending

    return (
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-semibold text-[var(--text)]">Unfinished order</span>
                        <span className="text-[13px] text-[#92814f]">
                            €{order.totalAmount} · #{order.id.slice(0, 8).toUpperCase()} is waiting for payment
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                    <button
                        onClick={() => cancel.mutate(order.id)}
                        disabled={busy}
                        className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-[#8a8a8a] transition-colors hover:bg-amber-100/60 hover:text-[#555] disabled:opacity-50"
                    >
                        {cancel.isPending ? "Cancelling…" : "Cancel"}
                    </button>
                    <button
                        onClick={() => resume.mutate(order.id)}
                        disabled={busy}
                        className="rounded-lg bg-[var(--text)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {resume.isPending ? "Redirecting…" : "Complete payment"}
                    </button>
                </div>
            </div>
        </div>
    )
}