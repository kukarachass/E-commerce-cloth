"use client"

import { useFilters } from "@/hooks/useFilters"

export default function ResetFiltersButton() {
    const { clearAll } = useFilters()

    return (
        <button
            onClick={clearAll}
            className="group flex flex-row gap-2 items-center text-[14px] text-[var(--text)] font-medium cursor-pointer"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-500 ease-in-out group-hover:rotate-[-360deg]"
            >
                <path
                    d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                    stroke="currentColor"
                />
                <path d="M3 3v5h5" stroke="currentColor"/>
            </svg>
            Reset all
        </button>
    )
}