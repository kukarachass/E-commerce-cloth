import OrderStatusBadge from "./OrderStatusBadge"

type OrderCardOrder = {
    id: string
    createdAt: string | Date
    email: string
    totalAmount: string
    paymentStatus: string
}

export default function OrderCard({ order }: { order: OrderCardOrder }) {
    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
    })

    return (
        <div className="group flex items-center justify-between rounded-2xl border border-[#ececec] bg-white p-5 transition-all duration-150 hover:border-[#d8d8d8] hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#a3a3a3]">
                    #{order.id.slice(0, 8)}
                </span>
                <span className="text-[15px] font-semibold text-[var(--text)]">{date}</span>
                <span className="text-[12px] text-[#a3a3a3]">{order.email}</span>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[16px] font-semibold tabular-nums text-[var(--text)]">€{order.totalAmount}</span>
                    <OrderStatusBadge status={order.paymentStatus} />
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#c4c4c4] transition-transform duration-150 group-hover:translate-x-0.5">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    )
}