"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import FaqAccordionItem from "@/components/account/customer-service/FaqAccordionItem"
import { FAQ_CATEGORIES } from "@/components/account/customer-service/data"

export default function FaqSection() {
    const [activeCategory, setActiveCategory] = useState(0)

    return (
        <div className="flex flex-col gap-4">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
                {FAQ_CATEGORIES.map((cat, i) => (
                    <button
                        key={cat.label}
                        onClick={() => setActiveCategory(i)}
                        className={`
                            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium
                            border transition-all duration-150
                            ${activeCategory === i
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400 hover:text-neutral-700"
                        }
                        `}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Items */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-xl border border-neutral-200 bg-white px-5 py-1"
                >
                    {FAQ_CATEGORIES[activeCategory].items.map((item) => (
                        <FaqAccordionItem key={item.question} {...item} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}