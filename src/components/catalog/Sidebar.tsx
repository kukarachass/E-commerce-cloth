"use client"

import { useState } from "react"
import cn from "classnames"
import { motion } from "framer-motion"
import {categoryItems} from "@/mocks/catalogStore";

export interface CategoryItem {
    name: string
    subcategories: readonly string[]
}

interface Props {
    title: string
    items: readonly CategoryItem[]
    noTitle?: boolean;
}

function SidebarCheckbox({ checked }: { checked: boolean }) {
    return (
        <div className={cn(
            "w-4 h-4 border rounded-sm flex items-center justify-center shrink-0 transition-colors",
            { "border-black": checked, "border-gray-300": !checked }
        )}>
            <motion.div
                initial={false}
                animate={{ scale: checked ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                className="w-2 h-2 bg-black rounded-[2px]"
            />
        </div>
    )
}

export default function Sidebar({ title, items, noTitle = false }: Props) {
    const [selectedAll, setSelectedAll] = useState(false)
    const [selected, setSelected] = useState<string[]>([])

    const toggle = (name: string) => {
        setSelected(prev =>
            prev.includes(name) ? prev.filter(v => v !== name) : [...prev, name]
        )
    }

    return (
        <div className="flex flex-col gap-4 pb-6">
            <div className="flex flex-row gap-4 pt-6 pb-3 max-h-[75px]">
                <h1 className="text-[var(--text)] text-[24px] leading-[133%] font-bold">{title}</h1>
                <span className="flex items-center text-[var(--text)] font-bold text-[12px] bg-[#f0f0f0] rounded-[16px] px-2">
                    11,525 results
                </span>
            </div>
            <div className="flex flex-col gap-1 overflow-y-auto h-[calc(100vh-113px)]">
                {/* заголовок категории */}
                {!noTitle && (
                    <label
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setSelectedAll(!selectedAll)}
                    >
                        <SidebarCheckbox checked={selectedAll} />
                        <span className="text-[16px] font-bold text-[var(--text)]">{title}</span>
                    </label>
                )}

                {/* подкатегории */}
                <div className="flex flex-col pl-5">
                    {items.map((item) => (
                        <div key={item.name}>
                            <label
                                className="flex items-center gap-3 py-1 cursor-pointer hover:bg-gray-100 transition-all duration-300 pl-2 rounded-[4px]"
                                onClick={() => toggle(item.name)}
                            >
                                <SidebarCheckbox checked={selected.includes(item.name)} />
                                <span className="text-[16px] text-[var(--text)]">{item.name}</span>
                            </label>

                            {item.subcategories.length > 0 && (
                                <div className="flex flex-col pl-5">
                                    {item.subcategories.map((sub) => (
                                        <label
                                            key={sub}
                                            className="flex items-center gap-3 py-1 cursor-pointer hover:bg-gray-100 transition-all duration-300 pl-2 rounded-[4px]"
                                            onClick={() => toggle(sub)}
                                        >
                                            <SidebarCheckbox checked={selected.includes(sub)} />
                                            <span className="text-[16px] text-[var(--text)]">{sub}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}