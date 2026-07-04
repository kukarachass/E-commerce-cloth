"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Checkbox from "@/components/ui/inputs/Checkbox"
import PasswordInput from "@/components/auth/PasswordInput"

const passwordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number"),
})

type PasswordValues = z.infer<typeof passwordSchema>

interface CreateAccountPanelProps {
    wantsAccount: boolean
    setWantsAccount: (value: boolean) => void
    onPasswordChange: (password: string | null) => void
}

export default function CreateAccountPanel({
                                               wantsAccount,
                                               setWantsAccount,
                                               onPasswordChange,
                                           }: CreateAccountPanelProps) {
    const { register, formState: { errors } } = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        mode: "onChange",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        const result = passwordSchema.safeParse({ password: val })
        onPasswordChange(result.success ? val : null)
    }

    return (
        <div className="bg-[#F9F9F9] rounded-[10px] flex flex-col gap-4 text-[var(--text)] p-4">
            <h1 className="text-[18px] sm:text-[24px] font-[600]">Create an account for easy tracking & returns</h1>
            <Checkbox label="Yes, create my account" checked={wantsAccount} setChecked={setWantsAccount} />
            {wantsAccount && (
                <div className="flex flex-col gap-1">
                    <PasswordInput placeholder="Password" {...register("password")} onChange={handleChange} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
            )}
        </div>
    )
}