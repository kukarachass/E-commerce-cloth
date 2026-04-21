"use client"
import { useRouter } from "next/navigation"
import cn from "classnames"
import { usePathname } from "next/navigation"

interface Props{
    className?: string;
}

export default function GenderSwitcher({ className }: Props ){
    const router = useRouter();
    const pathname = usePathname();

    return(
        <div className={`${className} flex w-full lg:w-auto lg:gap-4 lg:p-0 lg:bg-transparent bg-[#f0f0f0] rounded-lg overflow-hidden`}>
            <button
                className={cn("flex-1 lg:flex-none py-2 lg:py-0 lg:pb-1 text-[16px] font-bold transition-all duration-200",{
                    ["text-[var(--header-muted)]"]: pathname !== "/women",
                })}
                onClick={() => router.push("/women")}
            >
                Women
            </button>
            <div className="block lg:hidden w-[1px] bg-[#d6d0ca]"/>
            <button
                className={cn("flex-1 lg:flex-none py-2 lg:py-0 lg:pb-1 text-[16px] font-bold transition-all duration-200",{
                    ["text-[var(--header-muted)]"]: pathname !== "/men",
                })}
                onClick={() => router.push("/men")}
            >
                Men
            </button>
        </div>
    )
}