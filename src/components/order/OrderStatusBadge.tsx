const STATUS: Record<string, { label: string; dot: string; text: string; bg: string }> = {
    paid:               { label: "Paid",                dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
    pending:            { label: "Awaiting payment",    dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50"   },
    failed:             { label: "Failed",              dot: "bg-red-500",     text: "text-red-600",     bg: "bg-red-50"     },
    expired:            { label: "Expired",             dot: "bg-zinc-400",    text: "text-zinc-500",    bg: "bg-zinc-100"   },
    refunded:           { label: "Refunded",            dot: "bg-violet-500",  text: "text-violet-700",  bg: "bg-violet-50"  },
    partially_refunded: { label: "Partially refunded",  dot: "bg-violet-400",  text: "text-violet-600",  bg: "bg-violet-50"  },
}

export default function OrderStatusBadge({ status }: { status: string }) {
    const s = STATUS[status] ?? STATUS.pending
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${s.bg} ${s.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    )
}