import type { ReturnItemStatus } from "@/lib/returns/status"

// подпись + цвет точки для каждого статуса возврата
const RETURN_STATUS: Record<ReturnItemStatus, { label: string; dot: string; text: string; bg: string }> = {
    requested: { label: "Return requested", dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50" },
    approved:  { label: "Return approved",  dot: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50" },
    refunded:  { label: "Refunded",         dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
    rejected:  { label: "Return declined",  dot: "bg-neutral-400", text: "text-neutral-500", bg: "bg-neutral-100" },
    cancelled: { label: "Return cancelled", dot: "bg-neutral-300", text: "text-neutral-400", bg: "bg-neutral-100" },
}

export default function ReturnStatusBadge({ status }: { status: ReturnItemStatus }) {
    const s = RETURN_STATUS[status]
    if (!s) return null
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${s.bg} ${s.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    )
}