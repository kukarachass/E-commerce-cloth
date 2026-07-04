"use client"

import { useRouter } from "next/navigation"
import { Gender, GENDERS, useGender } from "@/hooks/useGender"
import cn from "classnames"

export default function GenderSwitcher({ className }: { className?: string}) {
    const router = useRouter()
    const currentGender = useGender()

    function switchGender(newGender: Gender) {
        router.push(`/${newGender}`)
    }

    return (
        <div className={`${className} flex items-stretch w-full lg:w-auto bg-[#f0f0f0] lg:bg-transparent rounded-[4px] lg:rounded-none overflow-hidden gap-0 lg:gap-2`}>
            {GENDERS.map((g, i) => (
                <div key={g} className="flex items-stretch flex-1 lg:flex-initial py-2">
                    {i > 0 && (
                        <div className="w-px bg-gray-300 self-stretch lg:hidden" />
                    )}
                    <button
                        onClick={() => switchGender(g)}
                        className={cn(
                            "capitalize cursor-pointer w-full lg:w-auto transition-colors duration-200",
                            "px-4 text-[15px] lg:p-0 lg:text-base",
                            "font-[600]",
                            g === currentGender
                                ? "text-[#2d2d2d] lg:border-b-[1px]"
                                : "text-gray-400 lg:text-black/50 hover:text-gray-600 lg:hover:text-black/50"
                        )}
                    >
                        {g}
                    </button>
                </div>
            ))}
        </div>
    )
}