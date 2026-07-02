"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { IOrderWithReturns } from "@/types/IOrder"
import { IOrderWithDetails } from "@/types/user"
import { useOrderDrawerData } from "@/hooks/order/useOrderDrawerData"
import {ShipmentSection} from "@/components/order/drawer/ShippmentSection";
import {ItemsSection} from "@/components/order/drawer/ItemSection";
import {SummarySection} from "@/components/order/drawer/SummarySection";
import {DeliverySection} from "@/components/order/drawer/DeliverySection";
import {PaymentSection} from "@/components/order/drawer/PaymentSection";
import {useSwipeToClose} from "@/hooks/layout/ui/useSwipeToClose";

interface Props {
    order: IOrderWithReturns | null
    onClose: () => void
}

export default function OrderDetailDrawer({ order, onClose }: Props) {
    const open          = !!order
    const data          = useOrderDrawerData(order)
    const { dragY, isDragging, dragHandlers } = useSwipeToClose(onClose)
    const paymentMethod = (order as IOrderWithDetails & { paymentMethod?: string })?.paymentMethod ?? null

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [onClose])

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{ opacity: open ? Math.max(0, 1 - dragY / 300) : 0 }}
                className={`fixed inset-0 bg-black/25 z-50 transition-opacity duration-200 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            />

            {/* Drawer */}
            <aside
                style={{
                    transform:  open ? `translateY(${dragY}px)` : undefined,
                    transition: isDragging ? "none" : undefined,
                }}
                className={`
                    fixed z-50 bg-white flex flex-col
                    bottom-0 left-0 right-0 max-h-[92svh] rounded-t-2xl border-t border-neutral-200
                    transition-transform duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]
                    ${open ? "translate-y-0" : "translate-y-full"}
                    sm:inset-y-0 sm:left-auto sm:right-0 sm:w-full sm:max-w-[420px]
                    sm:max-h-none sm:rounded-none sm:border-t-0 sm:border-l
                    ${open ? "sm:translate-y-0 sm:translate-x-0" : "sm:translate-x-full"}
                `}
                role="dialog"
                aria-modal="true"
                aria-label="Order details"
            >
                {/* Drag handle — только мобилка */}
                <div
                    className="flex justify-center pt-3 pb-2 sm:hidden shrink-0 cursor-grab touch-none"
                    {...dragHandlers}
                >
                    <div className={`w-10 h-1 rounded-full transition-colors ${isDragging ? "bg-neutral-400" : "bg-neutral-200"}`} />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between px-5 py-4 border-b border-neutral-100 shrink-0">
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
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50 transition-colors"
                        aria-label="Close"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Body */}
                {order && data && (
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="flex flex-col divide-y divide-neutral-100">
                            <ShipmentSection
                                displayStatus={data.displayStatus}
                                formattedDate={data.formattedDate}
                                currentStep={data.currentStep}
                                isCancelled={data.isCancelled}
                                isReturned={data.isReturned}
                            />
                            <ItemsSection items={order.items} />
                            <SummarySection
                                total={data.total}
                                deliveryFee={data.deliveryFee}
                                saved={data.saved}
                            />
                            {data.formattedAddress && <DeliverySection address={data.formattedAddress} />}
                            {paymentMethod && <PaymentSection method={paymentMethod} />}
                        </div>
                    </div>
                )}

                {/* Footer */}
                {order && !data?.isCancelled && !data?.isReturned && (
                    <div className="px-5 py-4 border-t border-neutral-100 flex gap-2.5 bg-white shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                        <button className="flex-1 py-2.5 text-[13px] font-medium text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                            Request a return
                        </button>
                        <button className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-700 transition-colors">
                            Track package
                        </button>
                    </div>
                )}
            </aside>
        </>
    )
}