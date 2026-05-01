"use client"
import Checkbox from "@/components/ui/inputs/Checkbox";
import {useState} from "react";
import BillingAddresForm from "@/components/checkout/BillingAddresForm";

export default function BillingAddress() {
    const [billingAddress, setBillingAddress] = useState(false)
    const [updateShipping, setUpdateShipping] = useState(false)
    return(
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <Checkbox checked={updateShipping} setChecked={setUpdateShipping} label={"Update shipping information to my profile"}/>
                <Checkbox checked={billingAddress} setChecked={setBillingAddress} label={"Billing address different to shipping address"}/>
            </div>

            {billingAddress && (
                <div className="flex flex-col gap-4">
                    <h1 className="text-[var(--text)] font-bold text-[24px] leading-[133%]">Billing Address</h1>
                    <BillingAddresForm/>
                </div>
            )}
        </div>
    )
}