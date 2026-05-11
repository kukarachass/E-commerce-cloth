"use client"

import Arrow from "@/components/ui/icons/Arrow";
import {useEffect, useRef, useState} from "react";
import FilterDropdown from "@/components/catalog/filters/FilterDropdown";
import BrandsContent from "@/components/catalog/filters/filters-modal-content/BrandsContent";
import SizeContent from "@/components/catalog/filters/filters-modal-content/SizeContent";
import PriceContent from "@/components/catalog/filters/filters-modal-content/PriceContent";
import ColoursContent from "@/components/catalog/filters/filters-modal-content/ColoursContent";
import PatternContent from "@/components/catalog/filters/filters-modal-content/PatternContent";
import StyleContent from "@/components/catalog/filters/filters-modal-content/StyleContent";
import DiscountContent from "@/components/catalog/filters/filters-modal-content/DiscountContent";
import Sort from "@/components/catalog/filters/Sort";

const filters = [
    { id: 1, name: "Brands"},
    { id: 2, name: "Size"},
    { id: 3, name: "Price"},
    { id: 4, name: "Colours"},
    { id: 5, name: "Pattern"},
    { id: 6, name: "Style"},
    { id: 7, name: "Discount"},
]
type FiltersType = typeof filters[number]["name"]

export default function FilterBar() {
    const[openedFilter, setOpenedFilter] = useState<FiltersType | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpenedFilter(null)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSetFilter = (filterName: FiltersType) => {
        if(openedFilter === filterName) {
            setOpenedFilter(null)
        } else{
            setOpenedFilter(filterName)
        }
    }
    return (
        <div className="flex flex-row justify-between w-full py-6 pr-1">
            <div ref={ref} className="flex flex-row gap-2">
                {filters.map((filter) => (
                    <div
                        onClick={() => handleSetFilter(filter.name)}
                        key={filter.id}
                        className="relative select-none flex flex-row items-center gap-3 text-[var(--text)] text-[16px] font-[600] border cursor-pointer border-[#ddd] rounded-[4px] px-2 py-[2px]">
                        <span>{filter.name}</span>
                        <Arrow className={`transition-all duration-200 ${openedFilter && filter.name === openedFilter && "rotate-180"}`}/>

                        {openedFilter === filter.name && (
                            <FilterDropdown>
                                {filter.name === "Brands" && <BrandsContent/>}
                                {filter.name === "Size" && <SizeContent/>}
                                {filter.name === "Price" && <PriceContent/>}
                                {filter.name === "Colours" && <ColoursContent/>}
                                {filter.name === "Pattern" && <PatternContent/>}
                                {filter.name === "Style" && <StyleContent/>}
                                {filter.name === "Discount" && <DiscountContent/>}
                            </FilterDropdown>
                        )}
                    </div>
                ))}
            </div>
            <Sort/>
        </div>
    )
}