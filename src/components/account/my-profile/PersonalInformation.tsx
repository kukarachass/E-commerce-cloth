"use client"


import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import DateInput from "@/components/account/my-profile/DateInput";
import GenderSelect from "@/components/account/my-profile/GenderSelect";
import {IUserWithDetails} from "@/types/user";
import {useUpdateProfile} from "@/hooks/profile /useUpdateProfile";
import {useForm} from "react-hook-form";
import {updateProfileSchema, UpdateProfileValues} from "@/lib/validators/update-profile-schema";
import {zodResolver} from "@hookform/resolvers/zod";


export default function PersonalInformationForm({ user }: { user: IUserWithDetails }) {
    const {mutate, isPending} = useUpdateProfile();
    const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm<UpdateProfileValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.name?.split(" ")[0] ?? "",
            lastName: user.lastName ?? "",
            email: user.email ?? "",
            phoneNumber: user.phoneNumber ?? "",
            dateOfBirth: user.dateOfBirth ?? "",
            gender: (user.gender as "male" | "female" | "other") ?? undefined,
            street: user.address?.street ?? "",
            houseNumber: user.address?.houseNumber ?? "",
            houseAddition: user.address?.houseAddition ?? "",
            postcode: user.address?.postcode ?? "",
            city: user.address?.city ?? "",
        }
    });

    function onSubmit(data: UpdateProfileValues) {
        mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <FloatingLabelInput
                        label="Email *"
                        readOnly
                        className={"focus:outline-none bg-[#F1F1F1] rounded-[10px]"}
                        value={watch("email")}
                        {...register("email")}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <DateInput
                        value={watch("dateOfBirth")}
                        onChange={(val) => setValue("dateOfBirth", val)}
                    />
                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}

                </div>
                <div className="flex flex-col gap-2">
                    <GenderSelect
                        value={watch("gender")}
                        onChange={(val) => setValue("gender", val as "male" | "female" | "other")}
                    />
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-3">
                    <FloatingLabelInput
                        label="Street *"
                        {...register("street")}
                        value={watch("street")}
                        className="col-span-2 md:col-span-1"
                    />
                    {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
                </div>
                <div className="flex flex-col gap-3">
                    <FloatingLabelInput
                        label="Number *"
                        value={watch("houseNumber")}
                        {...register("houseNumber")}
                    />
                    {errors.houseNumber && <p className="text-red-500 text-sm">{errors.houseNumber.message}</p>}
                </div>
                <div className="flex flex-col gap-3">
                    <FloatingLabelInput
                        label="House addition"
                        value={watch("houseAddition")}
                        {...register("houseAddition")}
                    />
                    {errors.houseAddition && <p className="text-red-500 text-sm">{errors.houseAddition.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <FloatingLabelInput
                        label="Postcode *"
                        value={watch("postcode")}
                        {...register("postcode")}
                    />
                    {errors.postcode && <p className="text-red-500 text-sm">{errors.postcode.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <FloatingLabelInput
                        label="City *"
                        value={watch("city")}
                        {...register("city")}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                </div>
            </div>

            <div className="pt-2">
                <ButtonPrimary variant="primary" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </ButtonPrimary>
            </div>
        </form>
    )
}
