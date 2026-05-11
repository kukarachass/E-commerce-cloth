"use client"

import { useState, useRef, useEffect } from "react"
import useClickOutside from "@/hooks/useClickOutside";

interface SizeSelectorProps {
    sizes: string[]
    onChange?: (size: string) => void
}

export default function SizeSelector({ sizes, onChange }: SizeSelectorProps) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)

    const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))

    const handleSelect = (size: string) => {
        setSelected(size)
        onChange?.(size)
        setOpen(false)
    }

    return (
        <div ref={ref} className="relative w-full">
            {/* Trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-4 py-[14px] rounded-[10px] border transition-colors duration-150 text-[14px]
                    ${open ? "border-[#1c1917]" : "border-[#ddd] hover:border-[#bbb]"}
                `}
            >
                <span className={selected ? "text-[var(--text)] font-medium" : "text-[#999]"}>
                    {selected ?? "Choose size"}
                </span>
                <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
                >
                    <path d="M4 6L8 10L12 6" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* Dropdown */}
            <div
                className={`absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-[#ddd] rounded-[10px] overflow-hidden z-20 shadow-sm
                    transition-all duration-200 origin-top
                    ${open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}
                `}
            >
                {sizes.map(size => (
                    <button
                        key={size}
                        onClick={() => handleSelect(size)}
                        className={`w-full text-left px-4 py-[11px] text-[14px] transition-colors duration-100
                            ${selected === size
                            ? "bg-[#f5f5f5] font-semibold text-[var(--text)]"
                            : "text-[var(--text)] hover:bg-[#fafafa]"
                        }
                        `}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    )
}