"use client"

import SocialsMethod from "@/components/auth/SocialsMethod";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {SignInFormValues, signInSchema} from "@/lib/validators/sign-in-schema";
import getSafeCallbackUrl from "@/utils/get-safe-callback";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";

export default function SignInForm(){
    const callbackUrl = getSafeCallbackUrl("/");
    const router = useRouter();
    const { signIn } = authClient;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        mode: "onTouched", // Ошибки появятся, когда пользователь "потрогает" поле и уйдет с него
    });

    async function onSubmit(data: SignInFormValues) {
        const res = await signIn.email({
            ...data,
            callbackURL: callbackUrl,
        });

        if (res.error) {
            toast.error(res.error.message || "Something went wrong.");
        } else {
            router.push(callbackUrl) // теперь безопасно
            toast.success("Sign In successfully");
        }
    }

    return(
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4 items-center pb-8">
                <h1 className='text-[var(--text)] text-[48px] leading-[121%] font-bold'>Sign In</h1>
                <span className="text-[var(--text)] text-[16px] leading-[150%]">300+ iconic brands you know and love.</span>
            </div>
            <SocialsMethod/>
            <div className="flex flex-row items-center gap-2 justify-between w-full">
                <div className="h-[1px] bg-gray-200 w-full"/>
                <span className="text-[var(--text)] text-[16px]">or</span>
                <div className="h-[1px] bg-gray-200 w-full"/>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <FormInput {...register("email")} placeholder="Email" name="email" type={"email"}/>
                    {errors.email && <p className="text-[13px] text-red-500 font-[600]">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <PasswordInput {...register("password")} placeholder="Password" name="password" type={"password"}/>
                    {errors.password && <p className="text-[13px] text-red-500 font-[600]">{errors.password.message}</p>}
                </div>

                <ButtonPrimary
                    disabled={isSubmitting}
                    variant={"primary"}
                >
                    { isSubmitting ? "Signing in..." : "Sign in"}
                </ButtonPrimary>
                <Link className="text-[14px] text-[var(--muted)] underline text-center" href="#">Forgot Password?</Link>
            </form>
        </div>
    )
}