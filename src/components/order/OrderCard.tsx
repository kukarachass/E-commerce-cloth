import { ChevronRight } from "lucide-react"
import OrderStatusBadge from "./OrderStatusBadge"
import { IOrderWithDetails } from "@/types/user"

interface OrderCardProps {
    order: IOrderWithDetails
    onClick: (order: IOrderWithDetails) => void
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })

    const total = parseFloat(order.totalAmount)

    // originalPrice берём из productSnapshot каждого item-а * quantity
    const originalTotal = order.items.reduce((acc, item) => {
        const snap = item.productSnapshot as { originalPrice?: string }
        const orig = snap?.originalPrice ? parseFloat(snap.originalPrice) : parseFloat(item.price)
        return acc + orig * item.quantity
    }, 0)
    const saved = originalTotal - total

    // Уникальные бренды из productSnapshot
    const brands = [
        ...new Set(
            order.items
                .map((item) => (item.productSnapshot as { brand?: string })?.brand)
                .filter((b): b is string => !!b)
        ),
    ].join(" · ")

    // Названия через запятую — обрежется через truncate
    const itemNames = order.items
        .map((item) => (item.productSnapshot as { name?: string })?.name ?? item.product.name)
        .join(", ")

    const itemCount = order.items.length

    return (
        <button
            onClick={() => onClick(order)}
            className="group w-full text-left bg-white border border-neutral-200 rounded-xl px-5 py-4 hover:border-neutral-300 hover:shadow-[0_1px_6px_rgba(0,0,0,0.06)] transition-all duration-150"
        >
            <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
                            #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-[11px] text-neutral-300">·</span>
                        <span className="text-[12px] text-neutral-400">{date}</span>
                    </div>

                    <p className="text-[14px] font-medium text-neutral-900 truncate leading-snug">
                        {itemNames}
                    </p>

                    <p className="text-[12px] text-neutral-400 truncate">
                        {[brands, `${itemCount} item${itemCount > 1 ? "s" : ""}`]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[15px] font-semibold text-neutral-900 tabular-nums">
                        €{total.toFixed(2)}
                    </span>

                    {saved > 0.01 ? (
                        <span className="text-[11px] font-medium text-emerald-600">
                            Saved €{saved.toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-[11px] text-neutral-300">—</span>
                    )}

                    <OrderStatusBadge status={order.paymentStatus} />
                </div>

                <ChevronRight
                    size={15}
                    className="text-neutral-300 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
                />
            </div>
        </button>
    )
}