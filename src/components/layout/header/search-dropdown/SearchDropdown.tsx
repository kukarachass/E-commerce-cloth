"use client"

import { motion } from "framer-motion"
import { useStickyStore } from "@/store/useStickyStore"
import { useBottomBarHeight, useMiddleBarHeight } from "@/store/useHeaderBarHeightStore"
import SearchDropDownContent from "@/components/layout/header/search-dropdown/SearchDropDownContent"

export default function SearchDropdown() {
    const isSticky = useStickyStore(state => state.isSticky)
    const bottomBarHeight = useBottomBarHeight(state => state.bottomBarHeight)
    const middleBarHeight = useMiddleBarHeight(state => state.middleBarHeight)

    // Десктопный расчёт offset'а (как раньше)
    const desktopTop = isSticky ? middleBarHeight : middleBarHeight + bottomBarHeight

    return (
        <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{ "--dropdown-top": `${desktopTop}px` } as React.CSSProperties}
            className="bg-white px-4 absolute right-0 left-0 overflow-hidden top-0 lg:top-[var(--dropdown-top)]"
        >
            <SearchDropDownContent />
        </motion.div>
    )
}