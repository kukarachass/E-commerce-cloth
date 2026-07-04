"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import FilterBadge from "@/components/catalog/filters/FilterBadge"
import ResetFiltersButton from "@/components/catalog/filters/ResetFiltersButton"
import BrandsContent from "@/components/catalog/filters/filters-modal-content/BrandsContent"
import SizeContent from "@/components/catalog/filters/filters-modal-content/SizeContent"
import PriceContent from "@/components/catalog/filters/filters-modal-content/PriceContent"
import ColoursContent from "@/components/catalog/filters/filters-modal-content/ColoursContent"
import PatternContent from "@/components/catalog/filters/filters-modal-content/PatternContent"
import StyleContent from "@/components/catalog/filters/filters-modal-content/StyleContent"
import DiscountContent from "@/components/catalog/filters/filters-modal-content/DiscountContent"
import { Brand } from "@/types/filters/brands"
import { Size } from "@/types/filters/size"
import { Price } from "@/types/filters/price"
import { Color } from "@/types/filters/color"
import { Pattern } from "@/types/filters/pattern"
import { Style } from "@/types/filters/style"
import { Discount } from "@/types/filters/discount"
import {useMobileFilterStore} from "@/store/adaptive/catalog/useMobileFilterStore";
import {useSwipeToClose} from "@/hooks/layout/ui/useSwipeToClose";
import FilterAccordionSection from "@/components/catalog/filters/adaptive/FilterAccordionSection";

interface Props {
    brands: Brand[]
    sizes: Size[]
    colors: Color[]
    price: Price[]
    category: string
    patterns: Pattern[]
    styles: Style[]
    discounts: Discount[]
}

const FILTER_KEYS = ["brand", "size", "color", "pattern", "style", "minPrice", "maxPrice", "discount"]

export default function MobileFilterSheet({ brands, sizes, colors, price, category, patterns, styles, discounts }: Props) {
    const isOpen = useMobileFilterStore(state => state.isOpen)
    const setOpen = useMobileFilterStore(state => state.setOpen)
    const handleClose = () => setOpen(false)
    const { dragY, isDragging, dragHandlers } = useSwipeToClose(handleClose)

    const searchParams = useSearchParams()
    const hasFilters = FILTER_KEYS.some(key => searchParams.has(key))

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
        document.addEventListener("keydown", onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [isOpen])

    const sections: { title: string; content: React.ReactNode }[] = [
        { title: "Brands",   content: <BrandsContent brands={brands} /> },
        { title: "Size",     content: <SizeContent availableSizes={sizes} category={category} /> },
        { title: "Price",    content: <PriceContent price={price} /> },
        { title: "Colours",  content: <ColoursContent colors={colors} /> },
        { title: "Pattern",  content: <PatternContent patterns={patterns} /> },
        { title: "Style",    content: <StyleContent styles={styles} /> },
        { title: "Discount", content: <DiscountContent discounts={discounts} /> },
    ]

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{ opacity: Math.max(0, 1 - dragY / 300) }}
                className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            />

            {/* Sheet */}
            <aside
                style={{
                    transform: `translateY(${dragY}px)`,
                    transition: isDragging ? "none" : undefined,
                }}
                className="fixed bottom-0 left-0 right-0 z-[51] flex flex-col bg-white rounded-t-2xl border-t border-neutral-200 max-h-[85svh] lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Filters"
            >
                {/* Drag handle */}
                <div
                    className="flex justify-center pt-3 pb-2 shrink-0 cursor-grab touch-none"
                    {...dragHandlers}
                >
                    <div className={`w-10 h-1 rounded-full transition-colors ${isDragging ? "bg-neutral-400" : "bg-neutral-200"}`} />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-5 pb-4 border-b border-neutral-100 shrink-0">
                    <span className="text-[15px] font-semibold text-neutral-900">Filters</span>
                    <button
                        onClick={handleClose}
                        aria-label="Close"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 3L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Accordion body */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    {sections.map((s) => (
                        <FilterAccordionSection
                            key={s.title}
                            title={s.title}
                            badge={<FilterBadge filterName={s.title} />}
                        >
                            {s.content}
                        </FilterAccordionSection>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-5 py-4 border-t border-neutral-100 shrink-0 bg-white pb-[calc(1rem+env(safe-area-inset-bottom))]">
                    {hasFilters && (
                        <div className="shrink-0">
                            <ResetFiltersButton />
                        </div>
                    )}
                    <button
                        onClick={handleClose}
                        className="flex-1 rounded-lg bg-neutral-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-neutral-800"
                    >
                        Show results
                    </button>
                </div>
            </aside>
        </>
    )
}