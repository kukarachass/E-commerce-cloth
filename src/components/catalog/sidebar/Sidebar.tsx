"use client"

import { useState } from "react"
import cn from "classnames"
import { motion, AnimatePresence } from "framer-motion"
import {Category} from "@/types/category";
import SidebarCheckbox from "@/components/catalog/sidebar/SidebarCheckbox";

interface Props {
    title: string
    items: Category[]
    noTitle?: boolean
    activeItem?: string
}

export default function Sidebar({ title, items, noTitle = false, activeItem }: Props) {
    const [selectedAll, setSelectedAll] = useState(false)
    const [selected, setSelected] = useState<string[]>(() =>
        activeItem ? [activeItem] : []
    )

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
                {!noTitle && (
                    <label
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setSelectedAll(!selectedAll)}
                    >
                        <SidebarCheckbox checked={selectedAll} />
                        <span className="text-[16px] font-bold text-[var(--text)]">{title}</span>
                    </label>
                )}

                <div className={`flex flex-col ${noTitle ? "" : "pl-5"}`}>
                    {items.map((item) => (
                        <div key={item.name}>
                            <label
                                className="flex items-center gap-3 py-1 cursor-pointer hover:bg-gray-100 transition-all duration-300 pl-2 rounded-[4px]"
                                onClick={() => toggle(item.name)}
                            >
                                <SidebarCheckbox checked={selected.includes(item.name)} />
                                <span className="text-[16px] text-[var(--text)]">{item.name}</span>
                            </label>

                            <AnimatePresence>
                                {item.subcategories && (
                                    <>
                                        {item.subcategories.length > 0 && selected.includes(item.name) && (
                                            <motion.div
                                                key={item.name + "-subs"}
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex flex-col pl-5 overflow-hidden"
                                            >
                                                {item.subcategories.map((sub) => (
                                                    <label
                                                        key={sub.id}
                                                        className="flex items-center gap-3 py-1 cursor-pointer hover:bg-gray-100 transition-all duration-300 pl-2 rounded-[4px]"
                                                        onClick={() => toggle(sub.name)}
                                                    >
                                                        <SidebarCheckbox checked={selected.includes(sub.name)} />
                                                        <span className="text-[16px] text-[var(--text)]">{sub.name}</span>
                                                    </label>
                                                ))}
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}