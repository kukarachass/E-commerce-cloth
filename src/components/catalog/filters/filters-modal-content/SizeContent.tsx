"use client"

import cn from "classnames"
import { useRef, useState } from "react"
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton"
import { useFilters } from "@/hooks/useFilters"
import { sizes as sizesConfig } from "@/mocks/catalogStore"
import { Size } from "@/types/filters/size"

interface SizeContentProps {
    availableSizes: Size[]
    category: string
}

export default function SizeContent({ availableSizes, category }: SizeContentProps) {
    const categoryKey = (
        category === "clothing" ? "clothes"
            : category === "sportswear" ? "sportswear"
                : category === "shoes" ? "shoes"
                    : "accessories"
    ) as keyof typeof sizesConfig

    const config = sizesConfig[categoryKey]
    const tabs = config.tabs
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>(tabs[0])

    const { setFilter, isSelected } = useFilters()

    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const handleTabClick = (tab: typeof tabs[number]) => {
        setActiveTab(tab)
        const section = sectionRefs.current[tab]
        const container = scrollContainerRef.current
        if (section && container) {
            container.scrollTo({ top: section.offsetTop - container.offsetTop, behavior: "smooth" })
        }
    }

    return (
        <div className="flex flex-col w-[480px] cursor-pointer">
            <div className="flex gap-1 border-b border-gray-100 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={cn("px-3 py-2 text-[13px] font-medium border-b-2 transition-colors shrink-0", {
                            "border-black text-black": activeTab === tab,
                            "border-transparent text-gray-400 hover:text-gray-600": activeTab !== tab,
                        })}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div ref={scrollContainerRef} className="overflow-y-auto max-h-[320px] p-4 flex flex-col gap-6">
                {tabs.map((tab) => {
                    const tabSizes = (config[tab as keyof typeof config] as readonly string[])
                        .filter(size => availableSizes.some(s => s.size === size))

                    if (tabSizes.length === 0) return null

                    return (
                        <div
                            key={tab}
                            ref={(el) => { sectionRefs.current[tab] = el }}
                            className="flex flex-col gap-2"
                        >
                            <span className="text-[13px] font-bold text-[var(--text)]">{tab}</span>
                            <div className="grid grid-cols-4 gap-2">
                                {tabSizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setFilter("size", size)}
                                        className={cn(
                                            "border rounded-lg py-2 text-[13px] transition-colors",
                                            {
                                                "border-black bg-black text-white": isSelected("size", size),
                                                "border-gray-200 text-[var(--text)] hover:border-black": !isSelected("size", size),
                                            }
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <ResetButton/>
        </div>
    )
}