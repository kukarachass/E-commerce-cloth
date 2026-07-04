"use client"

import { REASON_LABEL, type ReturnReason } from "@/lib/returns/reasons"
import { ReturnableItem } from "@/types/returns"

type Selection = Record<string, { quantity: number; reason: ReturnReason | null }>
type Props = { items: ReturnableItem[]; selection: Selection }

export default function ReviewStep({ items, selection }: Props) {
    const rows = items.filter((i) => selection[i.id])
    const refund = rows.reduce((sum, i) => sum + Number(i.price) * selection[i.id].quantity, 0)

    return (
        <div className="flex flex-col gap-5">
            <div className="overflow-hidden rounded-xl border border-neutral-200">
                {rows.map((item, idx) => {
                    const sel = selection[item.id]
                    return (
                        <div
                            key={item.id}
                            className={`flex items-center justify-between gap-3 p-4 ${idx > 0 ? "border-t border-neutral-100" : ""}`}
                        >
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                <span className="truncate text-[14px] font-medium text-neutral-900">
                                    {item.product.name}
                                </span>
                                <span className="text-[12px] text-neutral-400">
                                    Size {item.size} · Qty {sel.quantity} · {sel.reason ? REASON_LABEL[sel.reason] : ""}
                                </span>
                            </div>
                            <span className="shrink-0 text-[14px] font-medium tabular-nums text-neutral-900">
                                €{(Number(item.price) * sel.quantity).toFixed(2)}
                            </span>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3.5">
                <span className="text-[13px] text-neutral-500">Estimated refund</span>
                <span className="text-[16px] font-semibold tabular-nums text-neutral-900">
                    €{refund.toFixed(2)}
                </span>
            </div>

            <p className="text-[12px] leading-relaxed text-neutral-400">
                Refunds are issued to your original payment method once we receive and inspect the items.
                Processing usually takes 5–10 business days.
            </p>
        </div>
    )
}