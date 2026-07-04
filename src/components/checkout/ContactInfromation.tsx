"use client"

import { useState } from "react"
import { useGetUser } from "@/hooks/user/useGetUser"
import CheckoutSkeletonLoader from "@/components/ui/skeleton-loaders/CheckoutSkeletonLoader"
import Checkbox from "@/components/ui/inputs/Checkbox"
import CheckoutForm from "@/components/checkout/CheckoutForm"
import ReadyUserView from "@/components/checkout/ReadyUserView"

export default function ContactInformation() {
    const [deliveryOption, setDeliveryOption] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const { data: user, isPending } = useGetUser()

    if (isPending) return <CheckoutSkeletonLoader />

    const showReadyView = !!user && user.readyToCheckout && !isEditing

    return (
        <div className="flex flex-col gap-6 sm:gap-8 w-full lg:max-w-[600px]">
            {showReadyView ? (
                <ReadyUserView user={user} onEdit={() => setIsEditing(true)} />
            ) : (
                <CheckoutForm user={user} />
            )}

            <div className="flex flex-col gap-4">
                <h3 className="text-[var(--text)] font-bold text-[20px] sm:text-[24px] leading-[133%]">
                    Delivery option
                </h3>
                <div className="p-4 flex flex-row gap-3 sm:gap-4 items-center bg-[#f9f9f9] rounded-[10px] border border-[#ccc]">
                    <Checkbox defaultChecked label="" checked={deliveryOption} setChecked={setDeliveryOption} />
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-[15px] sm:text-[16px] text-[var(--text)] font-bold">Royal Mail · £5.95</h3>
                        <span className="text-[#999] text-[13px] sm:text-[14px]">Standard delivery</span>
                    </div>
                </div>
            </div>
        </div>
    )
}