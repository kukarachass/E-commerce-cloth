import AuthFormWrapper from "@/components/auth/AuthFormWrapper"
import AuthMethodSwitcher from "@/components/auth/AuthMethodSwitcher";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

interface Props {
    searchParams: Promise<{ method?: "sign-in" | "sign-up" }>
}

export default async function AuthPage({searchParams}: Props) {
    const {method = "sign-in"} = await searchParams

    return (
        <div className="flex flex-col gap-10 items-center max-w-[350px] w-full mx-auto">
            <AuthMethodSwitcher/>
            <AuthFormWrapper method={method}>
                {method === "sign-in" ? <SignInForm/> : <SignUpForm/>}
            </AuthFormWrapper>
        </div>
    )
}