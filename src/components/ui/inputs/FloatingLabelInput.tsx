"use client"

import cn from "classnames"
import { useState } from "react"

interface Props {
    label: string;
    placeholder?: string;
    className?: string;
}

export default function FloatingLabelInput({ label, placeholder, className }: Props) {
    const [value, setValue] = useState("")

    return (
        <div className={`${className} relative`}>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
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