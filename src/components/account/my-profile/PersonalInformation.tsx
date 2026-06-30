"use client"

import { ReactNode } from "react"
import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput"
import PhoneInput from "@/components/ui/inputs/PhoneInput"
import DateInput from "@/components/account/my-profile/DateInput"
import GenderSelect from "@/components/account/my-profile/GenderSelect"
import { IUserWithDetails } from "@/types/user"
import { useUpdateProfile } from "@/hooks/profile /useUpdateProfile"
import { useForm } from "react-hook-form"
import { updateProfileSchema, UpdateProfileValues } from "@/lib/validators/update-profile-schema"
import { zodResolver } from "@hookform/resolvers/zod"

// ── вспомогательные компоненты ───────────────────────────────────────────────

function FormGroup({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase">
                {title}
            </p>
            {children}
        </div>
    )
}

function FormField({ error, children }: { error?: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            {children}
            {error && (
                <p className="text-[12px] text-red-500">{error}</p>
            )}
        </div>
    )
}

// ── основной компонент ───────────────────────────────────────────────────────

export default function PersonalInformationForm({ user }: { user: IUserWithDetails }) {
    const { mutate, isPending } = useUpdateProfile()

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UpdateProfileValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name:          user.name?.split(" ")[0] ?? "",
            lastName:      user.lastName ?? "",
            email:         user.email ?? "",
            phoneNumber:   user.phoneNumber ?? "",
            dateOfBirth:   user.dateOfBirth ?? "",
            gender:        (user.gender as "male" | "female" | "other") ?? undefined,
            street:        user.address?.street ?? "",
            houseNumber:   user.address?.houseNumber ?? "",
            houseAddition: user.address?.houseAddition ?? "",
            postcode:      user.address?.postcode ?? "",
            city:          user.address?.city ?? "",
        },
    })

    return (
        <form onSubmit={handleSubmit((data) => mutate(data))} className="flex flex-col gap-8">

            {/* Personal */}
            <FormGroup title="Personal">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField error={errors.name?.message}>
                        <FloatingLabelInput
                            label="First name *"
                            value={watch("name")}
                            {...register("name")}
                        />
                    </FormField>
                    <FormField error={errors.lastName?.message}>
                        <FloatingLabelInput
                            label="Last name *"
                            value={watch("lastName")}
                            {...register("lastName")}
                        />
                    </FormField>
                    <FormField error={errors.dateOfBirth?.message}>
                        <DateInput
                            value={watch("dateOfBirth") ?? null}
                            onChange={(val) => setValue("dateOfBirth", val)}
                        />
                    </FormField>
                    <FormField error={errors.gender?.message}>
                        <GenderSelect
                            value={watch("gender")}
                            onChange={(val) => setValue("gender", val as "male" | "female" | "other")}
                        />
                    </FormField>
                </div>
            </FormGroup>

            {/* Contact */}
            <FormGroup title="Contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField error={errors.email?.message}>
                        <FloatingLabelInput
                            label="Email *"
                            readOnly
                            className="bg-neutral-50 cursor-default focus:outline-none rounded-lg"
                            value={watch("email")}
                            {...register("email")}
                        />
                    </FormField>
                    <FormField error={errors.phoneNumber?.message}>
                        <div className="flex gap-2">
                            <PhoneInput />
                            <FloatingLabelInput
                                label="Phone number"
                                className="flex-1"
                                value={watch("phoneNumber")}
                                {...register("phoneNumber")}
                            />
                        </div>
                    </FormField>
                </div>
            </FormGroup>

            {/* Address */}
            <FormGroup title="Address">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <FormField error={errors.street?.message}>
                        <FloatingLabelInput
                            label="Street *"
                            value={watch("street")}
                            {...register("street")}
                        />
                    </FormField>
                    <FormField error={errors.houseNumber?.message}>
                        <FloatingLabelInput
                            label="Number *"
                            value={watch("houseNumber")}
                            {...register("houseNumber")}
                        />
                    </FormField>
                    <FormField error={errors.houseAddition?.message}>
                        <FloatingLabelInput
                            label="Addition"
                            value={watch("houseAddition")}
                            {...register("houseAddition")}
                        />
                    </FormField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField error={errors.postcode?.message}>
                        <FloatingLabelInput
                            label="Postcode *"
                            value={watch("postcode")}
                            {...register("postcode")}
                        />
                    </FormField>
                    <FormField error={errors.city?.message}>
                        <FloatingLabelInput
                            label="City *"
                            value={watch("city")}
                            {...register("city")}
                        />
                    </FormField>
                </div>
            </FormGroup>

            {/* Submit */}
            <div className="flex justify-end pt-2 border-t border-neutral-100">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Saving…" : "Save changes"}
                </button>
            </div>
        </form>
    )
}