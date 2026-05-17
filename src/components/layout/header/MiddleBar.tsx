"use client"

import GenderSwitcher from "@/components/layout/header/GenderSwitcher";
import Image from "next/image";
import cn from "classnames"
import {useStickyStore} from "@/store/useStickyStore";
import {useSearchStore} from "@/store/useSearchOpen";
import { AnimatePresence } from "framer-motion"
import {useEffect, useRef} from "react";
import {useMiddleBarHeight} from "@/store/useHeaderBarHeightStore";
import SearchDropdown from "@/components/layout/header/search-dropdown/SearchDropdown";
import ActionButtons from "@/components/layout/header/action-buttons/ActionButtons";
import Link from "next/link";
import Container from "@/components/layout/Сontainer";

export default function MiddleBar() {
    const isSticky = useStickyStore(state => state.isSticky)
    const searchOpen = useSearchStore(state => state.searchOpen);

    const setMiddleBarHeight = useMiddleBarHeight(state => state.setMiddleBarHeight)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMiddleBarHeight(ref.current?.offsetHeight ?? 0)
    }, [])


    return(
        <div ref={ref} className={cn("bg-white z-50 sticky top-0",{
            ["shadow-[0_2px_8px_rgba(0,0,0,0.08)]"]: isSticky
        })}>
            <Container className="flex items-center justify-between py-4">
                <GenderSwitcher/>
                <Link href="/">
                    <Image src={"/logo.svg"} alt={"logo"} width={100} height={24}/>
                </Link>
                <ActionButtons/>
            </Container>

            {/* вместо {searchOpen && <SearchDropdown />} */}
            <AnimatePresence>
                {searchOpen && <SearchDropdown />}
            </AnimatePresence>
        </div>
    )
}