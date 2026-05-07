"use client"

import { useState } from "react"
import SizeGuideModal from "@/components/product/size-guide/SizeGuideModal";

export default function SizeGuideButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="ml-auto text-[14px] text-[var(--text)] w-fit underline underline-offset-2 hover:text-[var(--text-hover)] transition-colors"
            >
                Size guide
            </button>

            <SizeGuideModal open={open} onClose={() => setOpen(false)} />
        </>
    )
}