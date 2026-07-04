"use client"

import { useState, ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface Props {
    title: string
    description?: string
    children: ReactNode
    defaultOpen?: boolean
}

export default function AccordionSection({ title, description, children, defaultOpen = true }: Props) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-neutral-50 transition-colors"
            >
                <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold text-neutral-900">{title}</span>
                    {description && (
                        <span className="text-[12px] text-neutral-400">{description}</span>
                    )}
                </div>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="shrink-0 ml-4"
                >
                    <ChevronDown size={16} className="text-neutral-400" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-neutral-100 px-6 py-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}