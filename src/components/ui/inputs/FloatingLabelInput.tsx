"use client"

import cn from "classnames"
import { useState } from "react"

interface Props {
    label: string
    placeholder?: string
    className?: string
    value?: string                      // добавь
    onChange?: (v: string) => void      // добавь
}

export default function FloatingLabelInput({ label, placeholder, className, value: externalValue, onChange }: Props) {
    const [internalValue, setInternalValue] = useState("")
    const value = externalValue !== undefined ? externalValue : internalValue

    return (
        <div className={`${className} relative`}>
            <input
                value={value}
                onChange={(e) => {
                    setInternalValue(e.target.value)
                    onChange?.(e.target.value)
                }}
                className={cn("py-3 px-4 w-full text-[14px] border border-[#ccc] rounded-[10px] text-[var(--text)]")}
                placeholder={placeholder ?? label}
                type="text"
            />
            {value && (
                <span className="absolute left-3 bottom-10 bg-white px-1 rounded text-[13px] text-[var(--text)] font-bold shadow-sm">
                    {label}
                </span>
            )}
        </div>
    )
}