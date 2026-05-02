"use client"

import cn from "classnames"
import { useState } from "react"

const countryCodes = [
    { code: "+44", flag: "🇬🇧", country: "GB" },
    { code: "+31", flag: "🇳🇱", country: "NL" },
    { code: "+1", flag: "🇺🇸", country: "US" },
    { code: "+49", flag: "🇩🇪", country: "DE" },
    { code: "+33", flag: "🇫🇷", country: "FR" },
    { code: "+380", flag: "🇺🇦", country: "UA" },
]

export default function PhoneInput() {
    const [selected, setSelected] = useState(countryCodes[0])

    return (
        <div className="relative max-w-[115px] w-full">
            <select
                className={cn("py-3 px-4 w-full text-[16px] border border-[#ccc] rounded-[10px] text-[var(--text)] appearance-none cursor-pointer bg-white")}
                value={selected.code}
                onChange={(e) => setSelected(countryCodes.find(c => c.code === e.target.value) ?? countryCodes[0])}
            >
                {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                    </option>
                ))}
            </select>
            <span className="absolute left-3 bottom-10 bg-white px-1 rounded text-[12px] text-[var(--text)] font-bold shadow-sm">
                Country code
            </span>
            {/* стрелка */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div>
        </div>
    )
}