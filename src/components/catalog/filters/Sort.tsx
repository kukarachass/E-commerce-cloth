import { useRef, useState } from "react"
import Arrow from "@/components/ui/icons/Arrow"
import { useFilters } from "@/hooks/useFilters"
import useClickOutside from "@/hooks/useClickOutside";

const sortVariants = [
    { label: "Popularity", value: "popularity" },
    { label: "New", value: "new" },
    { label: "New discount", value: "discount-desc" },
    { label: "Price: high to low", value: "price-desc" },
    { label: "Price: low to high", value: "price-asc" },
]

export default function Sort() {
    const [open, setOpen] = useState(false)
    const { setUniqueFilter, searchParams } = useFilters()
    const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

    const currentSort = searchParams.get("sort") ?? "popularity"
    const selectedLabel = sortVariants.find(s => s.value === currentSort)?.label ?? "Popularity"

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen(!open)}
                className="flex cursor-pointer select-none flex-row items-center gap-2"
            >
                <span className="capitalize text-[15px] font-bold leading-[150%]">{selectedLabel}</span>
                <Arrow className={`${open ? "rotate-180" : ""} transition-all duration-200`}/>
            </div>
            {open && (
                <div className="p-2 top-[40px] min-w-[200px] right-0 flex flex-col absolute bg-white rounded-[10px] border border-[#ddd] h-fit z-50">
                    {sortVariants.map((sort) => (
                        <div
                            key={sort.value}
                            onClick={() => {
                                setUniqueFilter({ sort: sort.value })
                                setOpen(false)
                            }}
                            className={`select-none capitalize hover:bg-gray-100 flex flex-row items-center gap-3 text-[14px] cursor-pointer rounded-[4px] px-2 py-[4px] ${
                                currentSort === sort.value ? "font-bold text-black" : "text-[var(--text)] font-normal"
                            }`}
                        >
                            {sort.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}