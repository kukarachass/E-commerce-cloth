import { Package } from "lucide-react"
import { getLatestReturnStatus } from "@/lib/returns/latestReturn"
import type { ReturnHistoryOrder } from "@/actions/returns/getReturnHistory"
import ReturnStatusBadge from "@/components/account/returns/ReturnStatusBadge";

type ProductSnapshot = { name?: string; brand?: string }

export default function ReturnHistoryCard({ order }: { order: ReturnHistoryOrder }) {
    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    })

    // только позиции, которые реально в значимом возврате
    const returnedItems = order.items
        .map((item) => ({ item, status: getLatestReturnStatus(item) }))
        .filter((x) => x.status !== null)

    if (returnedItems.length === 0) return null

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
            {/* шапка заказа */}
            <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                        #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-[11px] text-neutral-300">·</span>
                    <span className="text-[12px] text-neutral-400">{date}</span>
                </div>
                <span className="text-[12px] text-neutral-400">
                    {returnedItems.length} {returnedItems.length === 1 ? "item" : "items"}
                </span>
            </div>

            {/* возвращённые позиции */}
            <div className="flex flex-col divide-y divide-neutral-100">
                {returnedItems.map(({ item, status }) => {
                    const snap = item.productSnapshot as ProductSnapshot
                    const name = snap?.name ?? item.product.name
                    const brand = snap?.brand ?? ""
                    const img = item.product.images?.[0]?.url

                    return (
                        <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-100">
                                {img ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={img} alt={name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <Package size={16} className="text-neutral-400" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-medium text-neutral-900">{name}</p>
                                <p className="mt-0.5 text-[11px] text-neutral-400">
                                    {[brand, `Size ${item.size}`].filter(Boolean).join(" · ")}
                                </p>
                            </div>

                            {status && <ReturnStatusBadge status={status} />}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}