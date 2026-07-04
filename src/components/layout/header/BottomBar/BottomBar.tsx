"use client"

import { motion, AnimatePresence } from "framer-motion"
import HeaderNav from "@/components/layout/header/BottomBar/HeaderNav"
import Search from "@/components/layout/header/BottomBar/Search"
import { useStickyStore } from "@/store/useStickyStore"
import { useSearchStore } from "@/store/useSearchOpen"
import { useBottomBarHeight } from "@/store/useHeaderBarHeightStore"
import { useElementHeight } from "@/hooks/layout/useElementHeight"
import Container from "@/components/layout/Сontainer"

export default function BottomBar() {
    const isSticky = useStickyStore(state => state.isSticky)
    const searchOpen = useSearchStore(state => state.searchOpen)
    const setBottomBarHeight = useBottomBarHeight(state => state.setBottomBarHeight)
    const ref = useElementHeight<HTMLDivElement>(setBottomBarHeight)

    return (
        <>
            <div ref={ref} className={`${searchOpen ? "relative z-40" : ""} hidden lg:block px-4 xl:px-0 bg-white`}>
                <Container className="flex justify-between items-center py-4">
                    <motion.div
                        animate={{ width: searchOpen ? 0 : "auto", opacity: searchOpen ? 0 : 1 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden whitespace-nowrap shrink-0"
                    >
                        <HeaderNav />
                    </motion.div>

                    <AnimatePresence>
                        {!isSticky && (
                            <motion.div
                                animate={{ width: searchOpen ? "100%" : "220px" }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className="overflow-hidden ml-auto"
                            >
                                <Search />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Container>
            </div>
        </>
    )
}