"use client"

import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const filterKeysMap: Record<string, string[]> = {
    Brands: ["brand"],
    Size: ["size"],
    Price: ["minPrice", "maxPrice"],
    Colours: ["color"],
    Pattern: ["pattern"],
    Style: ["style"],
    Discount: ["discount"],
}

export default function FilterBadge({ filterName }: { filterName: string }) {
    const searchParams = useSearchParams()
    const keys = filterKeysMap[filterName] ?? []
    const count = keys.reduce((acc, key) => acc + searchParams.getAll(key).length, 0)

    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-[11px] font-medium"
                >
                    {count}
                </motion.span>
            )}
        </AnimatePresence>
    )
}