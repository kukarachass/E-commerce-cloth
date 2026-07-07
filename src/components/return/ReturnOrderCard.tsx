import {ReturnableOrder} from "@/types/returns";
import {getLatestReturnStatus} from "@/lib/returns/latestReturn";
import useCancelPaidOrder from "@/hooks/order/useCancelPaidOrder";

interface ReturnOrderCardProps {
    order: ReturnableOrder;
    selectedId: string | null;
    onSelect: (orderId: string) => void
}

export default function ReturnOrderCard({order, selectedId, onSelect}: ReturnOrderCardProps) {
    const selected = order.id === selectedId
    const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    })

    const inReturnCount = order.items.filter(
        (item) => getLatestReturnStatus(item) !== null,
    ).length

    return (
        <button
            onClick={() => onSelect(order.id)}
            className={`flex items-center justify-between rounded-xl border p-4 sm:p-5 text-left transition-all ${
                selected
                    ? "border-neutral-900 ring-1 ring-neutral-900"
                    : "border-neutral-200 hover:border-neutral-300"
            }`}
        >
            <div className="flex flex-col gap-1 min-w-0 flex-1 mr-3 sm:mr-4">
                            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                                #{order.id.slice(0, 8)}
                            </span>
                <span className="text-[14px] sm:text-[15px] font-medium text-neutral-900">
                                {date}
                            </span>
                <span className="text-[12px] text-neutral-400">
                                {order.items.length} {order.items.length === 1 ? "item" : "items"}
                            </span>
                {inReturnCount > 0 && (
                    <span
                        className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"/>
                        {inReturnCount} in return
                                </span>
                )}
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                            <span className="text-[14px] sm:text-[15px] font-medium tabular-nums text-neutral-900">
                                €{order.totalAmount}
                            </span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                    selected ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                }`}>
                                {selected && <span className="h-2 w-2 rounded-full bg-white"/>}
                            </span>
            </div>
        </button>
    )
}