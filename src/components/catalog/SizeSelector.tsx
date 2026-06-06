"use client"

import { useState } from "react"
import useClickOutside from "@/hooks/useClickOutside"
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary"
import { productSize } from "@/db/schema"

type ProductSize = typeof productSize.$inferSelect

interface SizeSelectorProps {
    sizes: ProductSize[]
    onChange?: (size: ProductSize) => void
}

export default function SizeSelector({ sizes, onChange }: SizeSelectorProps) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<ProductSize | null>(null)
    const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
    console.log("sizes", sizes)

    const handleSelect = (size: ProductSize) => {
        setSelected(size)
        onChange?.(size)
        setOpen(false)
    }

    return (
        <div ref={ref} className="relative w-full">
            <ButtonPrimary
                variant="secondary"
                onClick={() => setOpen(!open)}
                className="w-full"
            >
                <span className={selected ? "text-[var(--text)] font-medium" : ""}>
                    {selected ? selected.size : "Choose size"}
                </span>
                <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className={`absolute top-[13px] right-[10px] transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
                >
                    <path d="M4 6L8 10L12 6" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </ButtonPrimary>

            <div className={`absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-[#ddd] rounded-[10px] overflow-hidden z-20 shadow-sm
                transition-all duration-200 origin-top
                ${open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}
            >
                {sizes.map(size => (
                    <button
                        key={size.id}
                        onClick={() => handleSelect(size)}
                        className={`w-full text-left px-4 py-[11px] text-[14px] transition-colors duration-100
                            ${selected?.id === size.id
                            ? "bg-[#f5f5f5] font-semibold text-[var(--text)]"
                            : "text-[var(--text)] hover:bg-[#fafafa]"
                        }`}
                    >
                        {size.size}
                    </button>
                ))}
            </div>
        </div>
    )
}