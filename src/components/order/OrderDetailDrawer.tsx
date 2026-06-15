"use client"

import { useEffect, useCallback } from "react"
import { X, MapPin, CreditCard, Package, Check } from "lucide-react"
import OrderStatusBadge from "./OrderStatusBadge"
import { IOrderWithDetails } from "@/types/user"

// productSnapshot shape — то что ты кладёшь в JSON при создании заказа
type ProductSnapshot = {
    name?: string
    brand?: string
    originalPrice?: string
    color?: string
    size?: string         // размер тоже можно класть в snapshot
}

// addressSnapshot shape
type AddressSnapshot = {
    street?: string
    houseNumber?: string
    houseAddition?: string
    postcode?: string
    city?: string
    country?: string
}

const STEPS = [
    "Order placed",
    "Payment confirmed",
    "Preparing shipment",
    "In transit",
    "Delivered",
]

// paymentStatus → шаг трекинга
const paymentToStep: Record<string, number> = {
    pending:  0,
    paid:     1,
}

// fulfillmentStatus → шаг трекинга (приоритет над paymentStatus для paid заказов)
const fulfillmentToStep: Record<string, number> = {
    unfulfilled: 1,
    processing:  2,
    shipped:     3,
    delivered:   4,
}

interface OrderDetailDrawerProps {
    order: IOrderWithDetails | null
    onClose: () => void
}

export default function OrderDetailDrawer({ order, onClose }: OrderDetailDrawerProps) {
    const open = !!order

    const handleKey = useCallback(
        (e: KeyboardEvent) => { if (e.key === "Escape") onClose() },
        [onClose]
    )

    useEffect(() => {
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [handleKey])

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    const isCancelled = order?.fulfillmentStatus === "cancelled"
    const isReturned  = order?.fulfillmentStatus === "returned"

    // Определяем текущий шаг: сначала смотрим fulfillment (если заказ оплачен),
    // иначе смотрим payment
    const currentStep = order
        ? order.paymentStatus === "paid" || order.paymentStatus === "refunded"
            ? (fulfillmentToStep[order.fulfillmentStatus] ?? 1)
            : (paymentToStep[order.paymentStatus] ?? 0)
        : -1

    // Статус для бейджа — показываем fulfillment если оплачено, иначе payment
    const displayStatus = order
        ? order.paymentStatus === "paid"
            ? order.fulfillmentStatus
            : order.paymentStatus
        : ""

    const total = order ? parseFloat(order.totalAmount) : 0

    const originalTotal = order
        ? order.items.reduce((acc, item) => {
            const snap = item.productSnapshot as ProductSnapshot
            const orig = snap?.originalPrice ? parseFloat(snap.originalPrice) : parseFloat(item.price)
            return acc + orig * item.quantity
        }, 0)
        : 0

    const saved = originalTotal - total

    const addressSnap = order?.addressSnapshot as AddressSnapshot | null

    const formattedAddress = addressSnap
        ? [
            `${addressSnap.street ?? ""} ${addressSnap.houseNumber ?? ""}${addressSnap.houseAddition ? ` ${addressSnap.houseAddition}` : ""}`.trim(),
            `${addressSnap.postcode ?? ""} ${addressSnap.city ?? ""}`.trim(),
            addressSnap.country,
        ]
            .filter(Boolean)
            .join(", ")
        : null

    const formattedDate = order
        ? new Date(order.createdAt).toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
        })
        : ""

    // Читаем payment method из первого payment relation если есть,
    // иначе — не показываем секцию (добавь payments в IOrderWithDetails если нужно)
    const paymentMethod = (order as IOrderWithDetails & { paymentMethod?: string })?.paymentMethod ?? null

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/25 z-50 transition-opacity duration-200 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Drawer */}
            <aside
                className={`fixed right-0 top-0 bottom-0 w-full max-w-[400px] bg-white border-l border-neutral-200 z-50 flex flex-col
                    transition-transform duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]
                    ${open ? "translate-x-0" : "translate-x-full"}`}
                aria-label="Order details"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-start justify-between px-5 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-semibold text-neutral-900">Order details</span>
                        {order && (
                            <span className="font-mono text-[11px] text-neutral-400 tracking-wider uppercase">
                                ORD-{order.id.slice(0, 8).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 transition-colors duration-100"
                        aria-label="Close"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Body */}
                {order && (
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col divide-y divide-neutral-100">

                            {/* Shipment */}
                            <section className="px-5 py-5">
                                <p className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase mb-3">
                                    Shipment
                                </p>
                                <div className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <OrderStatusBadge status={displayStatus} />
                                        <span className="text-[12px] text-neutral-400">{formattedDate}</span>
                                    </div>

                                    {!isCancelled && !isReturned && (
                                        <div className="flex flex-col">
                                            {STEPS.map((step, i) => {
                                                const done   = i <= currentStep
                                                const active = i === currentStep
                                                const last   = i === STEPS.length - 1
                                                return (
                                                    <div key={step} className="flex gap-3 items-stretch">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`
                                                                w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5
                                                                ${done ? "bg-neutral-900" : "bg-white border border-neutral-200"}
                                                            `}>
                                                                {done && <Check size={10} strokeWidth={2.5} className="text-white" />}
                                                            </div>
                                                            {!last && (
                                                                <div className={`w-px flex-1 my-1 ${i < currentStep ? "bg-neutral-900" : "bg-neutral-200"}`} />
                                                            )}
                                                        </div>
                                                        <div className={`pb-3 pt-0.5 flex-1 ${last ? "pb-0" : ""}`}>
                                                            <span className={`text-[13px] ${active ? "font-medium text-neutral-900" : done ? "text-neutral-700" : "text-neutral-400"}`}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Items */}
                            {order.items.length > 0 && (
                                <section className="px-5 py-5">
                                    <p className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase mb-3">
                                        Items ({order.items.length})
                                    </p>
                                    <div className="flex flex-col divide-y divide-neutral-100">
                                        {order.items.map((item) => {
                                            const snap      = item.productSnapshot as ProductSnapshot
                                            const price     = parseFloat(item.price)
                                            const origPrice = snap?.originalPrice ? parseFloat(snap.originalPrice) : null
                                            const name      = snap?.name      ?? item.product.name
                                            const brand     = snap?.brand     ?? ""
                                            const color     = snap?.color     ?? ""

                                            return (
                                                <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                                    <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-100 flex items-center justify-center shrink-0">
                                                        <Package size={16} className="text-neutral-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] font-medium text-neutral-900 truncate">
                                                            {name}
                                                        </p>
                                                        <p className="text-[11px] text-neutral-400 mt-0.5">
                                                            {[brand, item.size, color].filter(Boolean).join(" · ")}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                                                        <span className="text-[13px] font-semibold text-neutral-900 tabular-nums">
                                                            €{price.toFixed(2)}
                                                        </span>
                                                        {origPrice && origPrice > price && (
                                                            <span className="text-[11px] text-neutral-400 line-through tabular-nums">
                                                                €{origPrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* Summary */}
                            <section className="px-5 py-5">
                                <p className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase mb-3">
                                    Summary
                                </p>
                                <div className="flex flex-col gap-2.5">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-neutral-500">Subtotal</span>
                                        <span className="text-neutral-900 tabular-nums">€{total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-neutral-500">Shipping</span>
                                        {parseFloat(order.deliveryFee) > 0 ? (
                                            <span className="text-neutral-900 tabular-nums">€{parseFloat(order.deliveryFee).toFixed(2)}</span>
                                        ) : (
                                            <span className="text-emerald-600 font-medium">Free</span>
                                        )}
                                    </div>
                                    {saved > 0.01 && (
                                        <div className="flex justify-between text-[13px]">
                                            <span className="text-neutral-500">You saved</span>
                                            <span className="text-emerald-600 font-medium tabular-nums">−€{saved.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-[14px] font-semibold pt-2.5 border-t border-neutral-100">
                                        <span className="text-neutral-900">Total</span>
                                        <span className="text-neutral-900 tabular-nums">
                                            €{(total + parseFloat(order.deliveryFee)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Delivery */}
                            {formattedAddress && (
                                <section className="px-5 py-5">
                                    <p className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase mb-3">
                                        Delivery
                                    </p>
                                    <div className="flex items-start gap-2.5">
                                        <MapPin size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                                        <span className="text-[13px] text-neutral-700">{formattedAddress}</span>
                                    </div>
                                </section>
                            )}

                            {/* Payment */}
                            {paymentMethod && (
                                <section className="px-5 py-5">
                                    <p className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase mb-3">
                                        Payment
                                    </p>
                                    <div className="flex items-center gap-2.5">
                                        <CreditCard size={14} className="text-neutral-400 shrink-0" />
                                        <span className="text-[13px] text-neutral-700">{paymentMethod}</span>
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                )}

                {/* Footer */}
                {order && !isCancelled && !isReturned && (
                    <div className="px-5 py-4 border-t border-neutral-100 flex gap-2.5 bg-white">
                        <button className="flex-1 py-2.5 text-[13px] font-medium text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-100">
                            Request a return
                        </button>
                        <button className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-700 transition-colors duration-100">
                            Track package
                        </button>
                    </div>
                )}
            </aside>
        </>
    )
}