// SidebarItem.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SidebarCheckbox from "@/components/catalog/sidebar/SidebarCheckbox"
import { Category } from "@/types/filters/category"
import { useFilters } from "@/hooks/useFilters"
import Arrow from "@/components/ui/icons/Arrow"

interface Props {
    item: Category
    depth?: number
}

export default function SidebarItem({ item, depth = 0 }: Props) {
    const { setFilter, isSelected, removeFilters, searchParams } = useFilters()
    const [expanded, setExpanded] = useState(false)

    const hasSubs = item.subcategories && item.subcategories.length > 0

    const handleClick = () => {
        const currentSubs = searchParams.getAll("subcategory")
        const alreadySelected = currentSubs.includes(item.slug)

        if (alreadySelected) {
            const subSlugs = item.subcategories?.map(s => s.slug) ?? []
            removeFilters("subcategory", [item.slug, ...subSlugs])
            setExpanded(false)
        } else {
            setFilter("subcategory", item.slug)
            if (hasSubs) setExpanded(true)
        }
    }

    return (
        <div>
            <label
                className="flex items-center gap-3 py-1 cursor-pointer hover:bg-gray-100 transition-all duration-300 pl-2 rounded-[4px]"
                style={{ paddingLeft: `${8 + depth * 20}px` }}
                onClick={handleClick}
            >
                <SidebarCheckbox checked={isSelected("subcategory", item.slug)}/>
                <span className="text-[16px] text-[var(--text)] flex-1">{item.name}</span>
                {hasSubs && (
                    <Arrow className={`transition-all duration-200 mr-2 ${expanded ? "rotate-180" : ""}`}/>
                )}
            </label>

            <AnimatePresence>
                {hasSubs && expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {item.subcategories!.map(sub => (
                            <SidebarItem key={sub.id} item={sub} depth={depth + 1}/>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}