"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface Props {
    question: string
    answer: string
}

export default function FaqAccordionItem({ question, answer }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border-b border-neutral-100 last:border-none">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
                <span className="text-[14px] font-medium text-neutral-900">{question}</span>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                >
                    <ChevronDown size={15} className="text-neutral-400" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-[13px] leading-relaxed text-neutral-500">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}