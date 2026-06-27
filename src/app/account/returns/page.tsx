"use client"

import { useState } from "react"
import { useReturnFlow } from "@/hooks/returns/useReturnFlow"
import { useGetReturnableOrders } from "@/hooks/returns/useGetReturnableOrders"
import { useCreateReturn } from "@/hooks/returns/useCreateReturn"
import ReturnProgress from "@/components/account/returns/ReturnProgress"
import SelectOrderStep from "@/components/account/returns/SelectOrderStep"
import SelectItemsStep from "@/components/account/returns/SelectItemsStep"
import ReviewStep from "@/components/account/returns/ReviewStep"
import ReturnSuccess from "@/components/account/returns/ReturnSuccess"

export default function ReturnsPage() {
    const { state, dispatch, canLeaveStep1, canLeaveStep2 } = useReturnFlow()
    const { data: orders } = useGetReturnableOrders()
    const createReturn = useCreateReturn()
    const [returnId, setReturnId] = useState<string | null>(null)

    const activeOrder = orders?.find((o) => o.id === state.orderId)

    const submit = () => {
        if (!state.orderId) return
        createReturn.mutate(
            {
                orderId: state.orderId,
                items: Object.entries(state.selection).map(([orderItemId, s]) => ({
                    orderItemId,
                    quantity: s.quantity,
                    reason: s.reason!, // на шаге 3 причина гарантированно есть
                })),
            },
            { onSuccess: (res) => res.ok && setReturnId(res.returnId) },
        )
    }

    // экран успеха
    if (returnId) {
        return (
            <div className="flex flex-col gap-6">
                <h1 className="text-[20px] font-semibold tracking-tight text-neutral-900">Create a Return</h1>
                <ReturnSuccess returnId={returnId} onDone={() => { dispatch({ type: "RESET" }); setReturnId(null) }} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[20px] font-semibold tracking-tight text-neutral-900">Create a Return</h1>
                    <p className="text-[14px] text-neutral-500">Select an order, choose the items, and tell us why.</p>
                </div>
                <ReturnProgress current={state.step} />
            </div>

            {/* шаги */}
            <div>
                {state.step === 1 && (
                    <SelectOrderStep
                        selectedId={state.orderId}
                        onSelect={(orderId) => dispatch({ type: "SELECT_ORDER", orderId })}
                    />
                )}

                {state.step === 2 && activeOrder && (
                    <SelectItemsStep
                        items={activeOrder.items}
                        selection={state.selection}
                        onToggle={(itemId) => dispatch({ type: "TOGGLE_ITEM", itemId })}
                        onQty={(itemId, quantity) => dispatch({ type: "SET_QTY", itemId, quantity })}
                        onReason={(itemId, reason) => dispatch({ type: "SET_REASON", itemId, reason })}
                    />
                )}

                {state.step === 3 && activeOrder && (
                    <ReviewStep items={activeOrder.items} selection={state.selection} />
                )}
            </div>

            {/* навигация */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-5">
                <button
                    onClick={() => dispatch({ type: "BACK" })}
                    disabled={state.step === 1}
                    className="rounded-lg px-4 py-2.5 text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 disabled:invisible"
                >
                    Back
                </button>

                {state.step < 3 ? (
                    <button
                        onClick={() => dispatch({ type: "NEXT" })}
                        disabled={state.step === 1 ? !canLeaveStep1 : !canLeaveStep2}
                        className="rounded-lg bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        onClick={submit}
                        disabled={createReturn.isPending}
                        className="rounded-lg bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                    >
                        {createReturn.isPending ? "Submitting…" : "Confirm return"}
                    </button>
                )}
            </div>
        </div>
    )
}