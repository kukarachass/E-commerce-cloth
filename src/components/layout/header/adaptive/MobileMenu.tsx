"use client"

import {motion, AnimatePresence} from "framer-motion"
import Link from "next/link"
import {usePathname, useRouter} from "next/navigation"
import GenderSwitcher from "@/components/layout/header/GenderSwitcher"
import {useMobileMenuStore} from "@/store/adaptive/useMobileMenuStore";
import {useNavLinks} from "@/hooks/layout/useNavLinks";
import MobileMenuActions from "@/components/layout/header/adaptive/MobileMenuActions";

export default function MobileMenu() {
    const isOpen = useMobileMenuStore(state => state.isOpen)
    const setOpen = useMobileMenuStore(state => state.setOpen)
    const links = useNavLinks()
    const pathname = usePathname()

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/")

    const handleClose = () => setOpen(false)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="mobile-menu-backdrop"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        className="fixed inset-0 bg-black/40 z-50 lg:hidden"
                        onClick={handleClose}
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="mobile-menu-drawer"
                        initial={{x: "-100%"}}
                        animate={{x: 0}}
                        exit={{x: "-100%"}}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                        className="fixed inset-y-0 left-0 sm:max-w-[560px] max-w-[320px] w-full bg-white z-[51] flex flex-col shadow-xl lg:hidden"
                        aria-label="Navigation menu"
                    >
                        <div className="flex flex-col items-center">
                            <div className="relative flex items-center justify-center px-5 py-4">
                                <h1 className="text-[var(--text)] font-bold text-[20px] flex justify-center text-center">Menu</h1>
                                <button
                                    onClick={handleClose}
                                    aria-label="Close menu"
                                    className="absolute right-[-210px] cursor-pointer"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 3L13 13" stroke="black" strokeWidth="1.5"/>
                                        <path d="M13 3L3 13" stroke="black" strokeWidth="1.5"/>
                                    </svg>
                                </button>
                            </div>

                            <GenderSwitcher className="max-w-[300px]"/>
                        </div>

                        {/* Links */}
                        <nav className="flex flex-col overflow-y-auto flex-1 py-2">
                            {links.map((link) => {
                                const active = isActive(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={handleClose}
                                        className={[
                                            "px-5 py-3.5 text-[15px] font-medium border-b border-gray-50 transition-colors",
                                            active
                                                ? "text-black"
                                                : "text-[var(--text)] hover:text-neutral-500",
                                        ].join(" ")}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        <MobileMenuActions onClose={handleClose}/>

                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
