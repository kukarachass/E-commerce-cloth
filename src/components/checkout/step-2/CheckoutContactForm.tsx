"use client"

import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
import BillingAddresForm from "@/components/checkout/BillingAddresForm";
import {IUserWithDetails} from "@/types/user";
import {useUpdateProfile} from "@/hooks/profile /useUpdateProfile";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import {useState} from "react";
import Checkbox from "@/components/ui/inputs/Checkbox";
import {useCheckoutStore} from "@/store/useCheckoutAddressStore";
import {
    updateProfileCheckoutSchema,
    UpdateProfileCheckoutValues
} from "@/lib/validators/update-profile-checkout-schema";

interface CheckoutContactFormProps {
    deliveryOption: boolean;
    setDeliveryOption: () => void;
    user: IUserWithDetails;
}

export default function CheckoutContactForm({deliveryOption, setDeliveryOption, user}: CheckoutContactFormProps) {
    const {mutate, isPending} = useUpdateProfile();
    const [billingAddress, setBillingAddress] = useState(false)
    const [updateShipping, setUpdateShipping] = useState(false)
    const setContactData = useCheckoutStore(s => s.setContactData);


    const {register, handleSubmit, watch, formState: {errors}} = useForm<UpdateProfileCheckoutValues>({
        resolver: zodResolver(updateProfileCheckoutSchema),
        defaultValues: {
            email: user.email,
            name: user.name?.split(" ")[0] ?? "",
            lastName: user.lastName ?? "",
            phoneNumber: user.phoneNumber ?? "",
            street: user.address?.street ?? "",
            houseNumber: user.address?.houseNumber ?? "",
            houseAddition: user.address?.houseAddition ?? "",
            postcode: user.address?.postcode ?? "",
            city: user.address?.city ?? "",
        }
    });

    function onSubmit(data: UpdateProfileCheckoutValues) {
        setContactData(data) // всегда

        if (updateShipping) {
            mutate(data) // дополнительно обновляем профиль
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <h1 className="text-[var(--text)] font-bold text-[24px] leading-[133%]">Contact information</h1>
                <div className="flex flex-col gap-4">
                    {/* row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <FloatingLabelInput
                                value={watch("name")}
                                label="First Name *"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                            <FloatingLabelInput
                                label="Last name *"
                                value={watch("lastName")}
                                {...register("lastName")}
                            />
                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    {/* row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingLabelInput
                            value={watch("email")}
                            {...register("email")}
                            className={"focus:outline-none"}
                            readOnly
                            label="Email *"
                        />

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-3">
                                <PhoneInput/>
                                <FloatingLabelInput
                                    label="Phone number"
                                    className="flex-1"
                                    value={watch("phoneNumber")}
                                    {...register("phoneNumber")}
                                />
                            </div>
                            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-[var(--text)] font-bold text-[24px] leading-[133%]">Shipping & billing
                        address</h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col gap-3 w-full">
                                <FloatingLabelInput
                                    label="Street *"
                                    {...register("street")}
                                    value={watch("street")}
                                    className="col-span-2 md:col-span-1"
                                />
                                {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
                            </div>
                            <div className="flex flex-row gap-2 w-full">
                                <div className="flex flex-col gap-3 w-full">
                                    <FloatingLabelInput
                                        label="Number *"
                                        value={watch("houseNumber")}
                                        {...register("houseNumber")}
                                    />
                                    {errors.houseNumber &&
                                        <p className="text-red-500 text-sm">{errors.houseNumber.message}</p>}
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    <FloatingLabelInput
                                        label="House addition"
                                        value={watch("houseAddition")}
                                        {...register("houseAddition")}
                                    />
                                    {errors.houseAddition &&
                                        <p className="text-red-500 text-sm">{errors.houseAddition.message}</p>}
                                </div>
                            </div>
                        </div>
                        {/* row 2 */}
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col gap-2 w-full">
                                <FloatingLabelInput
                                    label="Postcode *"
                                    value={watch("postcode")}
                                    {...register("postcode")}
                                />
                                {errors.postcode && <p className="text-red-500 text-sm">{errors.postcode.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <FloatingLabelInput
                                    label="City *"
                                    value={watch("city")}
                                    {...register("city")}
                                />
                                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                            </div>
                        </div>
                        {/* row 3 */}
                        <FloatingLabelInput label="Country *"/>
                    </div>
                </div>
                <div className="pt-2">
                    <ButtonPrimary type={"submit"} variant="primary" disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </ButtonPrimary>
                </div>
            </form>

            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <Checkbox checked={updateShipping} setChecked={setUpdateShipping}
                              label={"Update shipping information to my profile"}/>
                    <Checkbox checked={billingAddress} setChecked={setBillingAddress}
                              label={"Billing address different to shipping address"}/>
                </div>

                {billingAddress && (
                    <div className="flex flex-col gap-4">
                        <h1 className="text-[var(--text)] font-bold text-[24px] leading-[133%]">Billing Address</h1>
                        <BillingAddresForm/>
                    </div>
                )}
            </div>
        </>
    )
}