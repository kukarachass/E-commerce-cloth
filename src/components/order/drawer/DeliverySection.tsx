import { MapPin } from "lucide-react"
import { DrawerSection } from "./DrawerSection"

export function DeliverySection({ address }: { address: string }) {
    return (
        <DrawerSection title="Delivery">
            <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                <span className="text-[13px] text-neutral-700">{address}</span>
            </div>
        </DrawerSection>
    )
}