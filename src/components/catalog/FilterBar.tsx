"use client"

import Arrow from "@/components/ui/icons/Arrow";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FilterDropdown from "@/components/catalog/filters/FilterDropdown";
import BrandsContent from "@/components/catalog/filters/filters-modal-content/BrandsContent";
import SizeContent from "@/components/catalog/filters/filters-modal-content/SizeContent";
import PriceContent from "@/components/catalog/filters/filters-modal-content/PriceContent";
import ColoursContent from "@/components/catalog/filters/filters-modal-content/ColoursContent";
import PatternContent from "@/components/catalog/filters/filters-modal-content/PatternContent";
import StyleContent from "@/components/catalog/filters/filters-modal-content/StyleContent";
import DiscountContent from "@/components/catalog/filters/filters-modal-content/DiscountContent";
import Sort from "@/components/catalog/filters/Sort";
import { Size } from "@/types/filters/size";
import { Brand } from "@/types/filters/brands";
import { Price } from "@/types/filters/price";
import { Color } from "@/types/filters/color";
import { Pattern } from "@/types/filters/pattern";
import { Style } from "@/types/filters/style";
import { Discount } from "@/types/filters/discount";
import ResetFiltersButton from "@/components/catalog/filters/ResetFiltersButton";
import { useSearchParams } from "next/navigation";
import FilterBadge from "@/components/catalog/filters/FilterBadge";

const FILTERS = [
    { id: 1, name: "Brands"   },
    { id: 2, name: "Size"     },
    { id: 3, name: "Price"    },
    { id: 4, name: "Colours"  },
    { id: 5, name: "Pattern"  },
    { id: 6, name: "Style"    },
    { id: 7, name: "Discount" },
] as const

type FiltersType = typeof FILTERS[number]["name"]

interface FilterBarProps {
    brands:    Brand[]
    sizes:     Size[]
    colors:    Color[]
    price:     Price[]
    category:  string
    patterns:  Pattern[]
    styles:    Style[]
    discounts: Discount[]
}

export default function FilterBar({ brands, sizes, category, price, colors, patterns, styles, discounts }: FilterBarProps) {
    const [openedFilter,   setOpenedFilter]   = useState<FiltersType | null>(null)
    const [dropdownPos,    setDropdownPos]    = useState<{ top: number; left: number } | null>(null)
    const [canScrollLeft,  setCanScrollLeft]  = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const searchParams = useSearchParams()
    const barRef       = useRef<HTMLDivElement>(null) // вся панель кнопок
    const dropdownRef  = useRef<HTMLDivElement>(null) // портальный дропдаун
    const scrollRef    = useRef<HTMLDivElement>(null) // скролл-трек

    const FILTER_KEYS = ["brand", "size", "color", "pattern", "style", "minPrice", "maxPrice", "discount", "sort"]
    const hasFilters  = FILTER_KEYS.some(key => searchParams.has(key))

    // ── Click outside: закрываем только если вне бара И вне дропдауна ──
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const inBar      = barRef.current?.contains(e.target as Node)
            const inDropdown = dropdownRef.current?.contains(e.target as Node)
            if (!inBar && !inDropdown) close()
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    // ── Scroll arrows ──
    const syncScroll = () => {
        const el = scrollRef.current
        if (!el) return
        setCanScrollLeft(el.scrollLeft > 1)
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
    }

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        syncScroll()
        el.addEventListener("scroll", syncScroll, { passive: true })
        const ro = new ResizeObserver(syncScroll)
        ro.observe(el)
        return () => { el.removeEventListener("scroll", syncScroll); ro.disconnect() }
    }, [])

    useEffect(() => { syncScroll() }, [searchParams])

    // ── Helpers ──
    const close = () => { setOpenedFilter(null); setDropdownPos(null) }

    const handleFilterClick = (name: FiltersType, e: React.MouseEvent<HTMLDivElement>) => {
        if (openedFilter === name) { close(); return }
        const rect = e.currentTarget.getBoundingClientRect()
        setDropdownPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX })
        setOpenedFilter(name)
    }

    const scrollTrack = (dir: "left" | "right") =>
        scrollRef.current?.scrollBy({ left: dir === "right" ? 180 : -180, behavior: "smooth" })

    // ── Dropdown content map ──
    const contentMap: Record<FiltersType, React.ReactNode> = {
        Brands:   <BrandsContent  brands={brands}                            />,
        Size:     <SizeContent    availableSizes={sizes} category={category} />,
        Price:    <PriceContent   price={price}                              />,
        Colours:  <ColoursContent colors={colors}                            />,
        Pattern:  <PatternContent patterns={patterns}                        />,
        Style:    <StyleContent   styles={styles}                            />,
        Discount: <DiscountContent discounts={discounts}                     />,
    }

    return (
        <>
            {/* Portal: рендерится в body, вне любого overflow */}
            {openedFilter && dropdownPos && createPortal(
                <div
                    ref={dropdownRef}
                    style={{ position: "absolute", top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
                >
                    <FilterDropdown>{contentMap[openedFilter]}</FilterDropdown>
                </div>,
                document.body
            )}

            <div className="flex flex-row items-center justify-between w-full py-6 pr-1 gap-4">

                {/* ── Scrollable filter strip ── */}
                <div ref={barRef} className="relative flex items-center max-w-[700px] flex-1">

                    {/* Left arrow */}
                    <button
                        onClick={() => scrollTrack("left")}
                        aria-label="Scroll left"
                        className={[
                            "absolute left-0 z-20 flex items-center justify-center",
                            "w-6 h-6 bg-white border border-[#ddd] rounded-full shadow-sm",
                            "hover:bg-neutral-50 transition-all duration-200",
                            canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                        ].join(" ")}
                    >
                        <Arrow className="rotate-90 w-3 h-3" />
                    </button>

                    <div className={[
                        "absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none",
                        "bg-gradient-to-r from-white to-transparent transition-opacity duration-200",
                        canScrollLeft ? "opacity-100" : "opacity-0",
                    ].join(" ")} />

                    {/* Scroll track */}
                    <div
                        ref={scrollRef}
                        className="flex flex-row gap-2 overflow-x-auto px-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {FILTERS.map((filter) => (
                            <div
                                key={filter.id}
                                onClick={(e) => handleFilterClick(filter.name, e)}
                                className={[
                                    "flex-shrink-0 select-none cursor-pointer",
                                    "flex flex-row items-center gap-3",
                                    "text-[var(--text)] text-[16px] font-[600]",
                                    "border rounded-[4px] px-2 py-[2px]",
                                    "transition-colors duration-200",
                                    openedFilter === filter.name
                                        ? "border-[#999]"
                                        : "border-[#ddd] hover:border-[#bbb]",
                                ].join(" ")}
                            >
                                <span>{filter.name}</span>
                                <FilterBadge filterName={filter.name} />
                                <Arrow className={`transition-all duration-200 ${openedFilter === filter.name ? "rotate-180" : ""}`} />
                            </div>
                        ))}
                    </div>

                    <div className={[
                        "absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none",
                        "bg-gradient-to-l from-white to-transparent transition-opacity duration-200",
                        canScrollRight ? "opacity-100" : "opacity-0",
                    ].join(" ")} />

                    {/* Right arrow */}
                    <button
                        onClick={() => scrollTrack("right")}
                        aria-label="Scroll right"
                        className={[
                            "absolute right-0 z-20 flex items-center justify-center",
                            "w-6 h-6 bg-white border border-[#ddd] rounded-full shadow-sm",
                            "hover:bg-neutral-50 transition-all duration-200",
                            canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                        ].join(" ")}
                    >
                        <Arrow className="-rotate-90 w-3 h-3" />
                    </button>
                </div>

                {/* ── Right: reset + sort ── */}
                <div className="flex flex-row gap-4 items-center flex-shrink-0">
                    {hasFilters && <ResetFiltersButton />}
                    <Sort />
                </div>
            </div>
        </>
    )
}