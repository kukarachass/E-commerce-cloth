"use client"

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown} from "lucide-react";
import {FaqItem} from "@/components/account/customer-service/data";

export default function FaqAccordionItem({ question, answer }: FaqItem) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border-b border-[#f0f0f0] last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-4 text-left cursor-pointer gap-4"
            >
                <span className="text-[15px] font-medium text-[var(--text)]">{question}</span>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-[#999]"
                >
                    <ChevronDown size={16} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="text-[14px] text-[#666] leading-relaxed pb-4 pr-8">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}