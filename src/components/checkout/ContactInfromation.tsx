"use client"

import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
import Checkbox from "@/components/ui/inputs/Checkbox";
import BillingAddresForm from "@/components/checkout/BillingAddresForm";
import BillingAddress from "@/components/checkout/BillingAddress";
import {useState} from "react";

export default function ContactInformation() {
    const [deliveryOption, setDeliveryOption] = useState(true)
    return(
        <div className="flex flex-col gap-8 max-w-[600px]">
            <div className="flex flex-col gap-6">
                <h1 className="text-[var(--text)] font-bold text-[24px] leading-[133%]">Contact information</h1>
                <div className="flex flex-col gap-4">
                    {/* row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingLabelInput label="First Name *" />
                        <FloatingLabelInput label="Last name *" />
                    </div>
                    {/* row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingLabelInput label="Email *" />
                        <div className="flex flex-row gap-2">
                            <PhoneInput />
                            <FloatingLabelInput label="Phone number" placeholder="Phone number" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <h1 className="text-[var(--text)] font-bold text-[24px] leading-[133%]">Shipping & billing address</h1>
                <BillingAddresForm/>
            </div>

            <BillingAddress/>

            <div className="flex flex-col gap-4">
                <h3 className="text-[var(--text)] font-bold text-[24px] leading-[133%]">Delivery option</h3>
                <div className="p-4 flex flex-row gap-4 items-center bg-[#f9f9f9] rounded-[10px] border border-[#ccc]">
                    <Checkbox defaultChecked label={""} checked={deliveryOption} setChecked={setDeliveryOption}/>
                    <div className="flex flex-col">
                        <h3 className="text-[16px] text-[var(--text)] font-bold">Royal Mail · £5.95</h3>
                        <span className="text-[#999] text-[14px]">Standard delivery</span>
                    </div>
                </div>
            </div>
        </div>
    )
}