"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, RotateCcw, UserRoundIcon, Users2 } from "lucide-react"

const navItems = [
    { label: "Orders",           href: "/account/my-orders",  icon: ShoppingBag },
    { label: "Returns",          href: "/account/returns",    icon: RotateCcw },
    { label: "Profile",          href: "/account/my-profile", icon: UserRoundIcon },
    { label: "Customer Service", href: "/customer-service",   icon: Users2 },
]

export default function AccountNavigation() {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile — горизонтальная скролл-полоса вместо сайдбара */}
            <nav className="md:hidden w-full border-b border-neutral-100 bg-white">
                <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`
                                    flex shrink-0 items-center gap-2 px-4 py-3.5
                                    text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap
                                    ${active
                                    ? "border-neutral-900 text-neutral-900"
                                    : "border-transparent text-neutral-400"
                                }
                                `}
                            >
                                <Icon size={14} strokeWidth={active ? 2 : 1.75} />
                                {label}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Desktop — вертикальный сайдбар (без изменений) */}
            <nav className="hidden md:flex flex-col w-full max-w-[220px] shrink-0">
                <p className="text-[11px] font-medium tracking-widest text-neutral-400 uppercase px-3 pb-3 mb-1 border-b border-neutral-100">
                    Account
                </p>
                <div className="flex flex-col gap-1">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`
                                    relative flex items-center gap-2.5 px-3 py-2 rounded-lg
                                    text-[14px] transition-colors duration-100
                                    ${active
                                    ? "text-neutral-900 font-medium bg-neutral-100"
                                    : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50"
                                }
                                `}
                            >
                                {active && (
                                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-neutral-900 rounded-full" />
                                )}
                                <Icon
                                    size={15}
                                    strokeWidth={active ? 2 : 1.75}
                                    className={active ? "text-neutral-900" : "text-neutral-400"}
                                />
                                {label}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}