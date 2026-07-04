import { CreditCard } from "lucide-react"
import { DrawerSection } from "./DrawerSection"

export function PaymentSection({ method }: { method: string }) {
    return (
        <DrawerSection title="Payment">
            <div className="flex items-center gap-2.5">
                <CreditCard size={14} className="text-neutral-400 shrink-0" />
                <span className="text-[13px] text-neutral-700">{method}</span>
            </div>
        </DrawerSection>
    )
}