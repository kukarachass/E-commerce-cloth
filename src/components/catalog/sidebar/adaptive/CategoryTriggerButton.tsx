"use client"


import {useCatalogSidebarStore} from "@/store/adaptive/catalog/useCatalogSidebarStore";

export default function CategoryTriggerButton() {
    const setOpen = useCatalogSidebarStore(state => state.setOpen)

    return (
        <button
            onClick={() => setOpen(true)}
            className="lg:hidden flex items-center gap-2 shrink-0 rounded-full border border-neutral-200 px-3 py-1.5 text-[13px] font-medium text-neutral-700 hover:border-neutral-300 transition-colors"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h10M4 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Categories
        </button>
    )
}