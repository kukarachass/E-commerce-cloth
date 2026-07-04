import { Check } from "lucide-react"
import OrderStatusBadge from "@/components/order/OrderStatusBadge"
import { DrawerSection } from "./DrawerSection"

const STEPS = [
    "Order placed",
    "Payment confirmed",
    "Preparing shipment",
    "In transit",
    "Delivered",
]

interface Props {
    displayStatus: string
    formattedDate: string
    currentStep: number
    isCancelled: boolean
    isReturned: boolean
}

export function ShipmentSection({ displayStatus, formattedDate, currentStep, isCancelled, isReturned }: Props) {
    return (
        <DrawerSection title="Shipment">
            <div className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-4">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
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
                                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done ? "bg-neutral-900" : "bg-white border border-neutral-200"}`}>
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
        </DrawerSection>
    )
}