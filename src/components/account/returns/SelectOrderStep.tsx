"use client"

import { useGetReturnableOrders } from "@/hooks/returns/useGetReturnableOrders"
import { getLatestReturnStatus } from "@/lib/returns/latestReturn"
import EmptyPage from "@/components/account/EmptyPage"

type Props = { selectedId: string | null; onSelect: (orderId: string) => void }

export default function SelectOrderStep({ selectedId, onSelect }: Props) {
    const { data: orders, isPending } = useGetReturnableOrders()

    if (isPending) {
        return (
            <div className="flex flex-col gap-3">
                {[0, 1, 2].map((i) => (
                    <div key={i} className="h-[88px] animate-pulse rounded-xl bg-neutral-100" />
                ))}
            </div>
        )
    }

    if (!orders || orders.length === 0) {
        return <EmptyPage pageName="orders" />
    }

    return (
        <div className="flex flex-col gap-3">
            {orders.map((order) => {
                const selected = order.id === selectedId
                const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                })

                // сколько позиций ЭТОГО заказа уже в каком-то значимом возврате
                const inReturnCount = order.items.filter(
                    (item) => getLatestReturnStatus(item) !== null,
                ).length

                return (
                    <button
                        key={order.id}
                        onClick={() => onSelect(order.id)}
                        className={`flex items-center justify-between rounded-xl border p-5 text-left transition-all ${
                            selected
                                ? "border-neutral-900 ring-1 ring-neutral-900"
                                : "border-neutral-200 hover:border-neutral-300"
                        }`}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                                #{order.id.slice(0, 8)}
                            </span>
                            <span className="text-[15px] font-medium text-neutral-900">{date}</span>
                            <span className="text-[12px] text-neutral-400">
                                {order.items.length} {order.items.length === 1 ? "item" : "items"}
                            </span>

                            {/* индикатор: часть позиций уже в возврате */}
                            {inReturnCount > 0 && (
                                <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    {inReturnCount} in return
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-[15px] font-medium tabular-nums text-neutral-900">€{order.totalAmount}</span>
                            <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                                    selected ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                                }`}
                            >
                                {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                            </span>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}