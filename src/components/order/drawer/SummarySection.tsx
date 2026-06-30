import { DrawerSection } from "./DrawerSection"

interface Props {
    total: number
    deliveryFee: number
    saved: number
}

export function SummarySection({ total, deliveryFee, saved }: Props) {
    return (
        <DrawerSection title="Summary">
            <div className="flex flex-col gap-2.5">
                <SummaryRow label="Subtotal" value={`€${total.toFixed(2)}`} />

                <div className="flex justify-between text-[13px]">
                    <span className="text-neutral-500">Shipping</span>
                    {deliveryFee > 0
                        ? <span className="text-neutral-900 tabular-nums">€{deliveryFee.toFixed(2)}</span>
                        : <span className="text-emerald-600 font-medium">Free</span>
                    }
                </div>

                {saved > 0.01 && (
                    <div className="flex justify-between text-[13px]">
                        <span className="text-neutral-500">You saved</span>
                        <span className="text-emerald-600 font-medium tabular-nums">−€{saved.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-[14px] font-semibold pt-2.5 border-t border-neutral-100">
                    <span className="text-neutral-900">Total</span>
                    <span className="text-neutral-900 tabular-nums">€{(total + deliveryFee).toFixed(2)}</span>
                </div>
            </div>
        </DrawerSection>
    )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-[13px]">
            <span className="text-neutral-500">{label}</span>
            <span className="text-neutral-900 tabular-nums">{value}</span>
        </div>
    )
}