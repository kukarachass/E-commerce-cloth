"use client"

import { useSearchParams, useRouter } from "next/navigation"

type AuthMethod = "sign-in" | "sign-up"

export default function AuthMethodSwitcher() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const active = (searchParams.get("method") as AuthMethod) ?? "sign-in"

    const handleSwitch = (method: AuthMethod) => {
        router.push(`/auth?method=${method}`)
    }

    return (
        <div className="flex w-full max-w-[400px]">
            {(["sign-in", "sign-up"] as AuthMethod[]).map((method) => (
                <button
                    key={method}
                    onClick={() => handleSwitch(method)}
                    className={`cursor-pointer flex-1 pb-3 text-sm transition-all duration-200 border-b-2 ${
                        active === method
                            ? "font-bold text-black border-black"
                            : "font-normal text-gray-400 border-gray-200"
                    }`}
                >
                    {method === "sign-in" ? "Sign in" : "Sign up"}
                </button>
            ))}
        </div>
    )
}