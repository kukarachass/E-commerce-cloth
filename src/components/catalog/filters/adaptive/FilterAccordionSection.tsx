"use client"

import { useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface Props {
    title: string
    badge?: ReactNode
    children: ReactNode
}

export default function FilterAccordionSection({ title, badge, children }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border-b border-neutral-100 last:border-none">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
            >
                <span className="flex items-center gap-2 text-[14px] font-medium text-neutral-900">
                    {title}
                    {badge}
                </span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-neutral-400" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}