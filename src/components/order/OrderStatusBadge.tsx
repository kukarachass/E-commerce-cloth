type OrderStatus = "paid" | "pending" | "cancelled" | "refunded" | "in_transit" | "delivered"

const config: Record<
    OrderStatus,
    { label: string; dot: string; bg: string; text: string }
> = {
    delivered:  { label: "Delivered",  dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700" },
    paid:       { label: "Paid",       dot: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700" },
    in_transit: { label: "In transit", dot: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700"   },
    pending:    { label: "Pending",    dot: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700"   },
    cancelled:  { label: "Cancelled",  dot: "bg-red-400",     bg: "bg-red-50",      text: "text-red-600"     },
    refunded:   { label: "Refunded",   dot: "bg-neutral-400", bg: "bg-neutral-100", text: "text-neutral-600" },
}

export default function OrderStatusBadge({ status }: { status: string }) {
    const s = (config[status as OrderStatus] ?? config.pending)
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    )
}