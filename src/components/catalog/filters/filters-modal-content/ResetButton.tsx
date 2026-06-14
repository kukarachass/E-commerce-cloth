"use client"

import {useFilters} from "@/hooks/useFilters";

export default function ResetButton({ keyName }: { keyName: string | string[] }) {
    const { clearFilter } = useFilters()
    return(
        <div className="border-t border-gray-100 px-4 py-3">
            <button onClick={() => clearFilter(keyName)} className="flex items-center gap-2 text-[13px] text-gray-400 hover:text-gray-600 transition-colors mx-auto">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Reset
            </button>
        </div>
    )
}