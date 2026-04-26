"use client"

import { motion } from "framer-motion"
import {useStickyStore} from "@/store/useStickyStore";
import {useBottomBarHeight, useMiddleBarHeight} from "@/store/useHeaderBarHeightStore";
import SearchDropDownContent from "@/components/layout/header/search-dropdown/SearchDropDownContent";

export default function SearchDropdown() {
    const isSticky = useStickyStore(state => state.isSticky)
    const bottomBarHeight = useBottomBarHeight(state => state.bottomBarHeight)
    const middleBarHeight = useMiddleBarHeight(state => state.middleBarHeight)

    return (
        <motion.div
            initial={{ height: 0}}
            animate={{ height: "auto"}}
            exit={{ height: 0}}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{ top: isSticky ? middleBarHeight : middleBarHeight + bottomBarHeight }}
            className="absolute right-0 left-0 overflow-hidden"
        >
            <SearchDropDownContent/>
        </motion.div>
    )
}