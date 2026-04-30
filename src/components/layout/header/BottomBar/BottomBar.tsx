"use client"

import { motion, AnimatePresence } from "framer-motion"
import HeaderNav from "@/components/layout/header/BottomBar/HeaderNav"
import Search from "@/components/layout/header/BottomBar/Search"
import { useStickyStore } from "@/store/useStickyStore"
import { useSearchStore } from "@/store/useSearchOpen"
import {useBottomBarHeight, useMiddleBarHeight} from "@/store/useHeaderBarHeightStore";
import {useEffect, useRef} from "react";

export default function BottomBar(){
    const isSticky = useStickyStore(state => state.isSticky)
    const searchOpen = useSearchStore(state => state.searchOpen)
    const setBottomBarHeight = useBottomBarHeight(state => state.setBottomBarHeight)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setBottomBarHeight(ref.current?.offsetHeight ?? 0)
    }, [])

    return (
        <div ref={ref} className={` ${searchOpen ? "relative z-40": "border-b border-gray-300"} bg-white`}>
            <div className="max-w-[1200px] mx-auto flex justify-between items-center py-4">
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
            </div>
        </div>
    )
}