import { ChevronRight } from "lucide-react"
import OrderStatusBadge from "./OrderStatusBadge"
import { IOrderWithReturns } from "@/types/IOrder"
import { getLatestReturnStatus } from "@/lib/returns/latestReturn"

interface OrderCardProps {
    order: IOrderWithReturns
    onClick: (order: IOrderWithReturns) => void
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    })

    const total = parseFloat(order.totalAmount)

    const originalTotal = order.items.reduce((acc, item) => {
        const snap = item.productSnapshot as { originalPrice?: string }
        const orig = snap?.originalPrice ? parseFloat(snap.originalPrice) : parseFloat(item.price)
        return acc + orig * item.quantity
    }, 0)
    const saved = originalTotal - total

    const brands = [
        ...new Set(
            order.items
                .map((item) => (item.productSnapshot as { brand?: string })?.brand)
                .filter((b): b is string => !!b)
        ),
    ].join(" · ")

    const itemNames = order.items
        .map((item) => (item.productSnapshot as { name?: string })?.name ?? item.product.name)
        .join(", ")

    const itemCount = order.items.length
    const itemsInReturn = order.items.filter(
        (item) => getLatestReturnStatus(item) !== null
    ).length

    return (
        <button
            onClick={() => onClick(order)}
            className="group w-full text-left bg-white border border-neutral-200 rounded-xl px-4 py-4 sm:px-5 hover:border-neutral-300 hover:shadow-[0_1px_6px_rgba(0,0,0,0.06)] transition-all duration-150"
        >
            <div className="flex items-start gap-3 sm:gap-4">

                {/* Left — info */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    {/* ID + date */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
                            #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-[11px] text-neutral-300">·</span>
                        <span className="text-[12px] text-neutral-400">{date}</span>
                    </div>

                    {/* Item names */}
                    <p className="text-[14px] font-medium text-neutral-900 truncate leading-snug">
                        {itemNames}
                    </p>

                    {/* Brands + count */}
                    <p className="text-[12px] text-neutral-400 truncate">
                        {[brands, `${itemCount} item${itemCount > 1 ? "s" : ""}`]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>

                    {/* Mobile: status badge + in-return badge inline */}
                    <div className="flex items-center gap-2 flex-wrap sm:hidden mt-0.5">
                        <OrderStatusBadge status={
                            order.paymentStatus === "paid"
                                ? order.fulfillmentStatus
                                : order.paymentStatus
                        } />
                        {itemsInReturn > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                {itemsInReturn} in return
                            </span>
                        )}
                    </div>
                </div>

                {/* Right — price, badges, chevron */}
                <div className="flex items-start gap-2 sm:gap-3 shrink-0">
                    <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[15px] font-semibold text-neutral-900 tabular-nums">
                            €{total.toFixed(2)}
                        </span>

                        {saved > 0.01 ? (
                            <span className="text-[11px] font-medium text-emerald-600">
                                Saved €{saved.toFixed(2)}
                            </span>
                        ) : (
                            <span className="hidden sm:block text-[11px] text-neutral-300">—</span>
                        )}

                        {/* Desktop: status + in-return */}
                        <div className="hidden sm:flex flex-row items-end gap-1.5">
                            {itemsInReturn > 0 && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    {itemsInReturn} {itemsInReturn === 1 ? "item" : "items"} in return
                                </span>
                            )}
                            <OrderStatusBadge status={
                                order.paymentStatus === "paid"
                                    ? order.fulfillmentStatus
                                    : order.paymentStatus
                            } />
                        </div>
                    </div>

                    <ChevronRight
                        size={15}
                        className="text-neutral-300 shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5"
                    />
                </div>
            </div>
        </button>
    )
}