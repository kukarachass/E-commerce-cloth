"use client"

import { AlertTriangle } from "lucide-react"

interface CancelOrderModalProps {
    open: boolean
    isPending: boolean
    onConfirm: () => void
    onClose: () => void
}

export function CancelOrderModal({ open, isPending, onConfirm, onClose }: CancelOrderModalProps) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:w-[380px] rounded-2xl bg-white p-5 sm:p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150"
            >
                <div className="flex flex-col items-center text-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle size={20} className="text-red-500" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <h3 className="text-[15px] font-semibold text-neutral-900">
                            Cancel this order?
                        </h3>
                        <p className="text-[13px] text-neutral-500 leading-relaxed">
                            This will cancel your order and refund your payment.
                            This action can&apos;t be undone.
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex gap-2.5">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 py-2.5 text-[13px] font-medium text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
                    >
                        Keep order
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 py-2.5 text-[13px] font-medium text-white bg-red-500 rounded-lg hover:bg-red-500/90 transition-colors disabled:opacity-60"
                    >
                        {isPending ? "Cancelling..." : "Yes, cancel"}
                    </button>
                </div>
            </div>
        </div>
    )
}