"use client"

import { useEffect } from "react"
import SizeGuide from "./SizeGuide"

interface SizeGuideModalProps {
    open: boolean
    onClose: () => void
}

export default function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
    // lock body scroll
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden"
        else document.body.style.overflow = ""
        return () => { document.body.style.overflow = "" }
    }, [open])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-[12px] w-full max-w-[680px] max-h-[85vh] overflow-y-auto mx-4 p-8"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 1L13 13M13 1L1 13" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>

                <SizeGuide />
            </div>
        </div>
    )
}