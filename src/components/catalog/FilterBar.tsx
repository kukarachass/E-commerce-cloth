"use client"

import Arrow from "@/components/ui/icons/Arrow"
import {useEffect, useRef, useState} from "react"
import {createPortal} from "react-dom"
import FilterDropdown from "@/components/catalog/filters/FilterDropdown"
import BrandsContent from "@/components/catalog/filters/filters-modal-content/BrandsContent"
import SizeContent from "@/components/catalog/filters/filters-modal-content/SizeContent"
import PriceContent from "@/components/catalog/filters/filters-modal-content/PriceContent"
import ColoursContent from "@/components/catalog/filters/filters-modal-content/ColoursContent"
import PatternContent from "@/components/catalog/filters/filters-modal-content/PatternContent"
import StyleContent from "@/components/catalog/filters/filters-modal-content/StyleContent"
import DiscountContent from "@/components/catalog/filters/filters-modal-content/DiscountContent"
import Sort from "@/components/catalog/filters/Sort"
import {Size} from "@/types/filters/size"
import {Brand} from "@/types/filters/brands"
import {Price} from "@/types/filters/price"
import {Color} from "@/types/filters/color"
import {Pattern} from "@/types/filters/pattern"
import {Style} from "@/types/filters/style"
import {Discount} from "@/types/filters/discount"
import ResetFiltersButton from "@/components/catalog/filters/ResetFiltersButton"
import {useSearchParams} from "next/navigation"
import FilterBadge from "@/components/catalog/filters/FilterBadge"
import {useActiveFilterCount} from "@/hooks/layout/catalog/useActiveFilterCount";
import {useMobileFilterStore} from "@/store/adaptive/catalog/useMobileFilterStore";
import MobileFilterSheet from "@/components/catalog/filters/adaptive/MobileFilterSheet";
import CategoryTriggerButton from "@/components/catalog/sidebar/adaptive/CategoryTriggerButton";

const FILTERS = [
    {id: 1, name: "Brands"},
    {id: 2, name: "Size"},
    {id: 3, name: "Price"},
    {id: 4, name: "Colours"},
    {id: 5, name: "Pattern"},
    {id: 6, name: "Style"},
    {id: 7, name: "Discount"},
] as const

type FiltersType = typeof FILTERS[number]["name"]

interface FilterBarProps {
    brands: Brand[]
    sizes: Size[]
    colors: Color[]
    price: Price[]
    category: string
    patterns: Pattern[]
    styles: Style[]
    discounts: Discount[]
    showCategoryTrigger?: boolean
}

export default function FilterBar({
                                      brands,
                                      sizes,
                                      category,
                                      price,
                                      colors,
                                      patterns,
                                      styles,
                                      discounts,
                                      showCategoryTrigger = true
                                  }: FilterBarProps) {
    const [openedFilter, setOpenedFilter] = useState<FiltersType | null>(null)
    const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const searchParams = useSearchParams()
    const barRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const activeFilterCount = useActiveFilterCount()
    const setMobileFilterOpen = useMobileFilterStore(state => state.setOpen)

    const FILTER_KEYS = ["brand", "size", "color", "pattern", "style", "minPrice", "maxPrice", "discount", "sort"]
    const hasFilters = FILTER_KEYS.some(key => searchParams.has(key))

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const inBar = barRef.current?.contains(e.target as Node)
            const inDropdown = dropdownRef.current?.contains(e.target as Node)
            if (!inBar && !inDropdown) close()
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

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
        el.addEventListener("scroll", syncScroll, {passive: true})
        const ro = new ResizeObserver(syncScroll)
        ro.observe(el)
        return () => {
            el.removeEventListener("scroll", syncScroll);
            ro.disconnect()
        }
    }, [])

    useEffect(() => {
        syncScroll()
    }, [searchParams])

    const close = () => {
        setOpenedFilter(null);
        setDropdownPos(null)
    }

    const handleFilterClick = (name: FiltersType, e: React.MouseEvent<HTMLDivElement>) => {
        if (openedFilter === name) {
            close();
            return
        }
        const rect = e.currentTarget.getBoundingClientRect()
        const dropdownWidth = 300 // соответствует min-w-[300px] в FilterDropdown
        const maxLeft = window.innerWidth - dropdownWidth - 12
        const left = Math.min(rect.left + window.scrollX, maxLeft + window.scrollX)
        setDropdownPos({top: rect.bottom + window.scrollY + 6, left: Math.max(12, left)})
        setOpenedFilter(name)
    }

    const scrollTrack = (dir: "left" | "right") =>
        scrollRef.current?.scrollBy({left: dir === "right" ? 180 : -180, behavior: "smooth"})

    const contentMap: Record<FiltersType, React.ReactNode> = {
        Brands: <BrandsContent brands={brands}/>,
        Size: <SizeContent availableSizes={sizes} category={category}/>,
        Price: <PriceContent price={price}/>,
        Colours: <ColoursContent colors={colors}/>,
        Pattern: <PatternContent patterns={patterns}/>,
        Style: <StyleContent styles={styles}/>,
        Discount: <DiscountContent discounts={discounts}/>,
    }

    return (
        <>
            {/* Portal — только для десктопных дропдаунов */}
            {openedFilter && dropdownPos && createPortal(
                <div
                    ref={dropdownRef}
                    style={{position: "absolute", top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999}}
                >
                    <FilterDropdown>{contentMap[openedFilter]}</FilterDropdown>
                </div>,
                document.body
            )}

            <MobileFilterSheet
                brands={brands} sizes={sizes} colors={colors} price={price}
                category={category} patterns={patterns} styles={styles} discounts={discounts}
            />

            {/* ── Desktop: горизонтальный скролл-бар с пилюлями ── */}
            <div className="hidden lg:flex flex-row items-center justify-between w-full py-6 gap-4 px-4 xl:px-0">
                <div ref={barRef} className="relative flex items-center max-w-[700px] flex-1">
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
                        <Arrow className="rotate-90 w-3 h-3"/>
                    </button>

                    <div className={[
                        "absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none",
                        "bg-gradient-to-r from-white to-transparent transition-opacity duration-200",
                        canScrollLeft ? "opacity-100" : "opacity-0",
                    ].join(" ")}/>

                    <div
                        ref={scrollRef}
                        className="flex flex-row gap-2 overflow-x-auto px-1"
                        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
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
                                <FilterBadge filterName={filter.name}/>
                                <Arrow
                                    className={`transition-all duration-200 ${openedFilter === filter.name ? "rotate-180" : ""}`}/>
                            </div>
                        ))}
                    </div>

                    <div className={[
                        "absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none",
                        "bg-gradient-to-l from-white to-transparent transition-opacity duration-200",
                        canScrollRight ? "opacity-100" : "opacity-0",
                    ].join(" ")}/>

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
                        <Arrow className="-rotate-90 w-3 h-3"/>
                    </button>
                </div>

                <div className="flex flex-row gap-4 items-center flex-shrink-0">
                    {hasFilters && <ResetFiltersButton/>}
                    <Sort/>
                </div>
            </div>

            {/* ── Mobile: три компактные кнопки ── */}
            <div className="flex lg:hidden items-center gap-2 w-full px-4 py-2">
                {showCategoryTrigger && (
                    <CategoryTriggerButton/>
                )}

                <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="flex items-center gap-1.5 shrink-0 rounded-full border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:border-neutral-300 transition-colors"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Filters
                    {activeFilterCount > 0 && (
                        <span
                            className="flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-medium">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                <div className="ml-auto shrink-0">
                    <Sort/>
                </div>
            </div>
        </>
    )
}