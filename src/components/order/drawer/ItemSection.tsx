import { Package } from "lucide-react"
import { DrawerSection } from "./DrawerSection"
import ReturnStatusBadge from "@/components/account/returns/ReturnStatusBadge"
import { getLatestReturnStatus } from "@/lib/returns/latestReturn"
import { IOrderWithReturns } from "@/types/IOrder"

type Item = IOrderWithReturns["items"][number]
type ProductSnapshot = { name?: string; brand?: string; originalPrice?: string; color?: string }

function OrderItem({ item }: { item: Item }) {
    const snap         = item.productSnapshot as ProductSnapshot
    const price        = parseFloat(item.price)
    const origPrice    = snap?.originalPrice ? parseFloat(snap.originalPrice) : null
    const name         = snap?.name  ?? item.product.name
    const returnStatus = getLatestReturnStatus(item)

    return (
        <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-100 flex items-center justify-center shrink-0">
                <Package size={16} className="text-neutral-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-neutral-900 truncate">{name}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                    {[snap?.brand, item.size, snap?.color].filter(Boolean).join(" · ")}
                </p>
                {returnStatus && (
                    <div className="mt-1.5">
                        <ReturnStatusBadge status={returnStatus} />
                    </div>
                )}
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span className="text-[13px] font-semibold text-neutral-900 tabular-nums">€{price.toFixed(2)}</span>
                {origPrice && origPrice > price && (
                    <span className="text-[11px] text-neutral-400 line-through tabular-nums">€{origPrice.toFixed(2)}</span>
                )}
            </div>
        </div>
    )
}

export function ItemsSection({ items }: { items: Item[] }) {
    if (items.length === 0) return null
    return (
        <DrawerSection title={`Items (${items.length})`}>
            <div className="flex flex-col divide-y divide-neutral-100">
                {items.map((item) => <OrderItem key={item.id} item={item} />)}
            </div>
        </DrawerSection>
    )
}