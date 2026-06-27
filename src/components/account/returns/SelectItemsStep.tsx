"use client"

import { RETURN_REASONS, type ReturnReason } from "@/lib/returns/reasons"
import {ReturnableItem} from "@/actions/returns/getReturnableOrders";
type Selection = Record<string, { quantity: number; reason: ReturnReason | null }>

type Props = {
    items: ReturnableItem[]
    selection: Selection
    onToggle: (itemId: string) => void
    onQty: (itemId: string, qty: number) => void
    onReason: (itemId: string, reason: ReturnReason) => void
}

export default function SelectItemsStep({ items, selection, onToggle, onQty, onReason }: Props) {
    return (
        <div className="flex flex-col gap-3">
            {items.map((item) => {
                const picked = selection[item.id]
                const checked = Boolean(picked)
                return (
                    <div
                        key={item.id}
                        className={`rounded-xl border p-4 transition-colors ${
                            checked ? "border-neutral-900" : "border-neutral-200"
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => onToggle(item.id)}
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
                                    checked ? "border-neutral-900 bg-neutral-900" : "border-neutral-300 hover:border-neutral-400"
                                }`}
                                aria-pressed={checked}
                            >
                                {checked && (
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                        <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>

                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                {item.product.images && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                                )}
                            </div>

                            <div className="flex flex-1 flex-col gap-0.5">
                                <span className="text-[14px] font-medium text-neutral-900">{item.product.name}</span>
                                <span className="text-[12px] text-neutral-400">
                                    Size {item.size} · Qty {item.quantity}
                                </span>
                            </div>

                            <span className="text-[14px] font-medium tabular-nums text-neutral-900">€{item.price}</span>
                        </div>

                        {/* раскрывается только для выбранной позиции */}
                        {checked && (
                            <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                {/* количество */}
                                {item.quantity > 1 && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-[12px] text-neutral-500">Quantity</span>
                                        <div className="flex items-center rounded-lg border border-neutral-200">
                                            <button
                                                onClick={() => onQty(item.id, Math.max(1, picked.quantity - 1))}
                                                className="px-2.5 py-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30"
                                                disabled={picked.quantity <= 1}
                                            >−</button>
                                            <span className="w-7 text-center text-[13px] tabular-nums text-neutral-900">{picked.quantity}</span>
                                            <button
                                                onClick={() => onQty(item.id, Math.min(item.quantity, picked.quantity + 1))}
                                                className="px-2.5 py-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-30"
                                                disabled={picked.quantity >= item.quantity}
                                            >+</button>
                                        </div>
                                    </div>
                                )}

                                {/* причина */}
                                <div className="relative sm:w-56">
                                    <select
                                        value={picked.reason ?? ""}
                                        onChange={(e) => onReason(item.id, e.target.value as ReturnReason)}
                                        className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 text-[13px] outline-none transition-colors ${
                                            picked.reason
                                                ? "border-neutral-300 text-neutral-900"
                                                : "border-neutral-200 text-neutral-400"
                                        } focus:border-neutral-900`}
                                    >
                                        <option value="" disabled>Select a reason</option>
                                        {RETURN_REASONS.map((r) => (
                                            <option key={r.value} value={r.value} className="text-neutral-900">{r.label}</option>
                                        ))}
                                    </select>
                                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}