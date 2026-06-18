"use client"


import cn from "classnames"
import { useRef, useState } from "react"
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton"
import { useFilters } from "@/hooks/useFilters"
import { Size } from "@/types/filters/size"

interface SizeContentProps {
    availableSizes: Size[]
    category: string
}

// INT порядок
const INT_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "OS"]

function sortSizes(sizes: string[], system: string): string[] {
    return [...sizes].sort((a, b) => {
        if (system === "Waist/Length") {
            const parse = (s: string) => {
                const m = s.match(/W(\d+)L(\d+)/)
                return m ? [parseInt(m[1]), parseInt(m[2])] : [0, 0]
            }
            const [aw, al] = parse(a)
            const [bw, bl] = parse(b)
            return aw !== bw ? aw - bw : al - bl
        }
        if (system === "Waist") {
            const num = (s: string) => parseFloat(s.replace("W", ""))
            return num(a) - num(b)
        }
        if (["EU", "UK", "US", "FR", "IT", "DE", "Size (cm)"].includes(system)) {
            return parseFloat(a) - parseFloat(b)
        }
        if (system === "INT") {
            const ai = INT_ORDER.indexOf(a)
            const bi = INT_ORDER.indexOf(b)
            if (ai !== -1 && bi !== -1) return ai - bi
        }
        return a.localeCompare(b)
    })
}

export default function SizeContent({ availableSizes, category }: SizeContentProps) {
    const { setFilter, isSelected } = useFilters()

    // Группируем доступные размеры по системе
    const systemsMap = availableSizes.reduce<Record<string, string[]>>((acc, s) => {
        if (!acc[s.sizeSystem]) acc[s.sizeSystem] = []
        if (!acc[s.sizeSystem].includes(s.size)) acc[s.sizeSystem].push(s.size)
        return acc
    }, {})

    // Порядок отображения систем
    const SYSTEM_ORDER = ["INT", "EU", "UK", "US", "FR", "IT", "DE", "Waist", "Waist/Length", "Other", "Years", "Size (cm)"]
    const tabs = SYSTEM_ORDER.filter(sys => systemsMap[sys]?.length > 0)

    const [activeTab, setActiveTab] = useState<string>(tabs[0] ?? "INT")

    const sectionRefs        = useRef<Record<string, HTMLDivElement | null>>({})
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const handleTabClick = (tab: string) => {
        setActiveTab(tab)
        const section   = sectionRefs.current[tab]
        const container = scrollContainerRef.current
        if (section && container) {
            container.scrollTo({ top: section.offsetTop - container.offsetTop, behavior: "smooth" })
        }
    }

    if (tabs.length === 0) {
        return (
            <div className="flex flex-col w-[480px] p-4">
                <p className="text-sm text-gray-400">No sizes available</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-[480px]">
            {/* Табы — только те системы которые реально есть у товаров в этой категории */}
            <div className="flex gap-1 border-b border-gray-100 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={cn(
                            "px-3 py-2 text-[13px] font-medium border-b-2 transition-colors shrink-0",
                            {
                                "border-black text-black":                                activeTab === tab,
                                "border-transparent text-gray-400 hover:text-gray-600":  activeTab !== tab,
                            },
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div ref={scrollContainerRef} className="overflow-y-auto max-h-[320px] p-4 flex flex-col gap-6">
                {tabs.map((tab) => {
                    const rawSizes = systemsMap[tab] ?? []
                    const tabSizes = sortSizes(rawSizes, tab)

                    return (
                        <div
                            key={tab}
                            ref={(el) => { sectionRefs.current[tab] = el }}
                            className="flex flex-col gap-2"
                        >
                            <span className="text-[13px] font-bold text-[var(--text)]">{tab}</span>
                            <div className="grid grid-cols-4 gap-2">
                                {tabSizes.map((size) => {
                                    const filterValue = `${tab}:${size}`
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => setFilter("size", filterValue)}
                                            className={cn(
                                                "border rounded-lg py-2 text-[13px] transition-colors",
                                                {
                                                    "border-black bg-black text-white":                      isSelected("size", filterValue),
                                                    "border-gray-200 text-[var(--text)] hover:border-black": !isSelected("size", filterValue),
                                                },
                                            )}
                                        >
                                            {size}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            <ResetButton keyName="size" />
        </div>
    )
}