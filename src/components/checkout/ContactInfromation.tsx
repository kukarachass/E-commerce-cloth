"use client"

import {useState} from "react";
import {useGetUser} from "@/hooks/user/useGetUser";
import CheckoutSkeletonLoader from "@/components/ui/skeleton-loaders/CheckoutSkeletonLoader";
import Checkbox from "@/components/ui/inputs/Checkbox";
import UserInformation from "@/components/checkout/step-2/UserInformation";
import CheckoutContactForm from "@/components/checkout/step-2/CheckoutContactForm";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

export default function ContactInformation() {
    const [deliveryOption, setDeliveryOption] = useState(true)
    const [isEditing, setIsEditing] = useState(false);
    const { data: user, isPending } = useGetUser();
    if(isPending) return <CheckoutSkeletonLoader/>
    if(!user) return null;
    
    return(
        <div className="flex flex-col gap-8 max-w-[600px] w-full">
            {user && user.readyToCheckout && !isEditing ? (
                <div className="flex flex-col gap-4">
                    <UserInformation user={user} />

                    <ButtonPrimary
                        variant="secondary"
                        onClick={() => setIsEditing(true)}
                        className="max-w-[200px]"
                    >
                        Edit details
                    </ButtonPrimary>
                </div>
            ) : (
                <CheckoutContactForm
                    user={user}
                    deliveryOption={deliveryOption}
                    setDeliveryOption={() => setDeliveryOption(true)}
                />
            )}
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