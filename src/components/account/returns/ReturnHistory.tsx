"use client"

import { useGetReturnHistory } from "@/hooks/returns/useGetReturnHistory"
import ReturnHistoryCard from "./ReturnHistoryCard"
import EmptyPage from "@/components/account/EmptyPage"

export default function ReturnHistory() {
    const { data: orders, isPending } = useGetReturnHistory()

    if (isPending) {
        return (
            <div className="flex flex-col gap-3">
                {[0, 1].map((i) => (
                    <div key={i} className="h-[160px] animate-pulse rounded-xl bg-neutral-100" />
                ))}
            </div>
        )
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="rounded-xl border border-neutral-200 bg-white px-6 py-14 text-center">
                <p className="text-[14px] font-medium text-neutral-900">No returns yet</p>
                <p className="mt-1 text-[13px] text-neutral-400">
                    When you return items, they’ll show up here.
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {orders.map((order) => (
                <ReturnHistoryCard key={order.id} order={order} />
            ))}
        </div>
    )
}