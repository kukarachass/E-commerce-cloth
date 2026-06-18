"use client"

// components/catalog/SizeSelector.tsx

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
    const [open, setOpen]       = useState(false)
    const [selected, setSelected] = useState<ProductSize | null>(null)
    const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

    const handleSelect = (size: ProductSize) => {
        setSelected(size)
        onChange?.(size)
        setOpen(false)
    }

    // Сортируем размеры внутри их системы в логичном порядке
    const sorted = [...sizes].sort((a, b) => {
        // Waist/Length: W26L30 < W26L32 < W27L30 ...
        if (a.sizeSystem === "Waist/Length") {
            const parseWL = (s: string) => {
                const m = s.match(/W(\d+)L(\d+)/)
                return m ? [parseInt(m[1]), parseInt(m[2])] : [0, 0]
            }
            const [aw, al] = parseWL(a.size)
            const [bw, bl] = parseWL(b.size)
            return aw !== bw ? aw - bw : al - bl
        }

        // EU/UK/US обувь: числовой порядок
        if (["EU", "UK", "US", "FR", "IT", "DE"].includes(a.sizeSystem)) {
            return parseFloat(a.size) - parseFloat(b.size)
        }

        // INT одежда: XS < S < M < L < XL < XXL < 3XL
        const INT_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"]
        const ai = INT_ORDER.indexOf(a.size)
        const bi = INT_ORDER.indexOf(b.size)
        if (ai !== -1 && bi !== -1) return ai - bi

        return a.size.localeCompare(b.size)
    })

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
                {sorted.map(size => (
                    <button
                        key={size.id}
                        onClick={() => handleSelect(size)}
                        className={`w-full text-left px-4 py-[11px] text-[14px] transition-colors duration-100 flex justify-between items-center
                            ${selected?.id === size.id
                            ? "bg-[#f5f5f5] font-semibold text-[var(--text)]"
                            : "text-[var(--text)] hover:bg-[#fafafa]"
                        }
                            ${size.stockAmount <= 2 ? "opacity-60" : ""}
                        `}
                    >
                        <span>{size.size}</span>
                        {size.stockAmount <= 2 && (
                            <span className="text-[11px] text-gray-400">Last {size.stockAmount}</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}