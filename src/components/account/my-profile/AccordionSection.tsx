"use client"

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown} from "lucide-react";

interface AccordionSectionProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}

export default function AccordionSection({ title, children, defaultOpen = true }: AccordionSectionProps) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="border-t border-gray-300">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-6 text-left cursor-pointer"
            >
                <span className="text-[18px] font-semibold text-[var(--text)]">{title}</span>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    <ChevronDown size={20} className="text-[var(--text)]" />
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
                        <div className="pb-8">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}