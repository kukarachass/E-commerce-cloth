"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {useNavLinks} from "@/hooks/layout/useNavLinks";

export default function HeaderNav() {
    const links = useNavLinks()
    const pathname = usePathname()

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/")

    return (
        <nav className="flex flex-row items-center gap-7">
            {links.map((link) => {
                const active = isActive(link.href)
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={[
                            "relative pb-[3px] font-medium transition-colors duration-200",
                            "after:absolute after:bottom-0 after:left-0 after:h-[1px]",
                            "after:transition-[width] after:duration-300 after:ease-out",
                            active
                                ? "text-[var(--text)] after:w-full after:bg-[var(--text)]"
                                : "text-neutral-400 after:w-0 after:bg-[var(--text)] hover:text-[var(--text)] hover:after:w-full",
                        ].join(" ")}
                    >
                        {link.label}
                    </Link>
                )
            })}
        </nav>
    )
}