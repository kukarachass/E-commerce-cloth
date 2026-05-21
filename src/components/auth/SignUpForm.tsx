"use client"

import SocialsMethod from "@/components/auth/SocialsMethod";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import Link from "next/link";
import getSafeCallbackUrl from "@/utils/get-safe-callback";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {SignUpFormValues, signUpSchema} from "@/lib/validators/sign-up-schema";
import {authClient} from "@/lib/auth-client";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function SignUpForm(){
    const router = useRouter();
    const callbackUrl = getSafeCallbackUrl("/");
    const { signUp } = authClient;
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        mode: "onTouched"
    });

    async function onSubmit(data: SignUpFormValues) {
        const {error} = await signUp.email({
            email: data.email,
            password: data.password,
            name: data.name,
        });

        if (error) {
            toast.error(error.message || "Something went wrong.");
        } else {
            toast.success("Sign up successfully");

            if (callbackUrl === "/") {
                router.push("/");
            } else {
                router.push(callbackUrl);
            }
        }
    }

    return(
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-4 items-center pb-8">
                <h1 className='text-[var(--text)] text-[48px] leading-[121%] font-bold'>Sign Up</h1>
                <span className="text-[var(--text)] text-[16px] leading-[150%] text-nowrap">300+ iconic brands you know and love. Up to 75% off.</span>
            </div>
            <SocialsMethod/>
            <div className="flex flex-row items-center gap-2 justify-between w-full">
                <div className="h-[1px] bg-gray-200 w-full"/>
                <span className="text-[var(--text)] text-[16px]">or</span>
                <div className="h-[1px] bg-gray-200 w-full"/>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <FormInput {...register("name")} placeholder="Name" name="name" type={"text"}/>
                    {errors.name && <p className="text-[13px] text-red-500 font-[600]">{errors.name.message}</p>}
                </div>
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
                    {isSubmitting ? "Signing up" : "Sign up"}
                </ButtonPrimary>
                <div className="text-[var(--muted)] text-[14px] text-center">
                    By signing up, you agree with our <Link className="underline" href="#">Terms & Conditions</Link>
                </div>
            </form>
        </div>
    )
}