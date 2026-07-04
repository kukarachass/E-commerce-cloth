"use client"

import GenderSwitcher from "@/components/layout/header/GenderSwitcher"
import Image from "next/image"
import cn from "classnames"
import { useStickyStore } from "@/store/useStickyStore"
import { useSearchStore } from "@/store/useSearchOpen"
import { AnimatePresence } from "framer-motion"
import { useMiddleBarHeight } from "@/store/useHeaderBarHeightStore"
import { useElementHeight } from "@/hooks/layout/useElementHeight"
import SearchDropdown from "@/components/layout/header/search-dropdown/SearchDropdown"
import ActionButtons from "@/components/layout/header/action-buttons/ActionButtons"
import Link from "next/link"
import Container from "@/components/layout/Сontainer"
import BurgerButton from "@/components/layout/header/adaptive/BurgerButton"
import SearchButton from "@/components/layout/header/adaptive/SearchButton"

interface Props {
    className?: string
}

export default function MiddleBar({ className }: Props) {
    const isSticky = useStickyStore(state => state.isSticky)
    const searchOpen = useSearchStore(state => state.searchOpen)

    const setMiddleBarHeight = useMiddleBarHeight(state => state.setMiddleBarHeight)
    const ref = useElementHeight<HTMLDivElement>(setMiddleBarHeight)

    return (
        <div ref={ref} className={cn(`bg-white z-40 sticky px-4 xl:px-0 top-0 ${className}`, {
            ["shadow-[0_2px_8px_rgba(0,0,0,0.08)]"]: isSticky
        })}>
            {/* Mobile: ряд с логотипом/иконками прячется, когда открыт поиск — дропдаун занимает его место */}
            <Container className={cn("flex items-center justify-between py-4", {
                "max-lg:hidden": searchOpen,
            })}>
                <div className="hidden lg:flex">
                    <GenderSwitcher />
                </div>
                <div className="flex flex-row gap-4 lg:hidden">
                    <BurgerButton />
                    <SearchButton />
                </div>
                <Link href="/">
                    <Image src={"/logo.svg"} alt={"logo"} width={100} height={24} />
                </Link>
                <ActionButtons />
            </Container>

            <AnimatePresence>
                {searchOpen && <SearchDropdown />}
            </AnimatePresence>
        </div>
    )
}