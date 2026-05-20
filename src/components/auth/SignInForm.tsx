import SocialsMethod from "@/components/auth/SocialsMethod";
import FormInput from "@/components/auth/FormInput";
import PasswordInput from "@/components/auth/PasswordInput";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import Link from "next/link";

export default function SignInForm(){
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
            <form className="flex flex-col gap-4" action="">
                <FormInput placeholder="Email" name="email" type={"email"}/>
                <PasswordInput placeholder="Password" name="password" type={"password"}/>
                <ButtonPrimary variant={"primary"}>
                    Sign In
                </ButtonPrimary>
                <Link className="text-[14px] text-[var(--muted)] underline text-center" href="#">Forgot Password?</Link>
            </form>
        </div>
    )
}