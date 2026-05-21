"use client"

import { useEffect, useRef } from "react"
import MyOrdersButton from "@/components/account/nav-items/MyOrdersButton";
import ReturnsButton from "@/components/account/nav-items/ReturnsButton";
import MyProfileButton from "@/components/account/nav-items/MyProfileButton";
import CustomerServiceButton from "@/components/account/nav-items/CustomerServiceButton";
import LogOutButton from "@/components/account/nav-items/LogOutButton";
import {authClient} from "@/lib/auth-client";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import {useRouter} from "next/navigation";

interface Props {
    onChange?: () => void;
}

export default function AccountActionsModal({ onChange }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { data: session } = authClient.useSession()

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onChange?.()
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [onChange])

    return (
        <div ref={ref} className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] flex flex-col min-w-[256px] rounded-[10px]">
            <MyOrdersButton />
            <ReturnsButton />
            <MyProfileButton />
            <CustomerServiceButton />
            {session && (
                <LogOutButton />
            )}
            {!session && (
                <div className="flex flex-col gap-2 p-4 pb-4">
                    <ButtonPrimary onClick={() => router.push("/auth?method=sign-in")} variant={'secondary'}>
                        Log In
                    </ButtonPrimary>
                    <ButtonPrimary onClick={() => router.push("/auth?method=sign-up")} variant={'primary'}>
                        Create an account
                    </ButtonPrimary>
                </div>
            )}
        </div>
    )
}