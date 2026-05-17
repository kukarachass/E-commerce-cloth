"use client"

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import FaqAccordionItem from "@/components/account/customer-service/FaqAccordionItem";
import {FAQ_CATEGORIES} from "@/components/account/customer-service/data";

export default function FaqSection() {
    const [activeCategory, setActiveCategory] = useState(0)

    return (
        <div className="flex flex-col gap-6">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
                {FAQ_CATEGORIES.map((cat, i) => (
                    <button
                        key={cat.label}
                        onClick={() => setActiveCategory(i)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-200 cursor-pointer ${
                            activeCategory === i
                                ? "bg-black text-white border-black"
                                : "bg-white text-[#666] border-[#e5e5e5] hover:border-black hover:text-[var(--text)]"
                        }`}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* FAQ items */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#fafafa] rounded-2xl px-6 py-2"
                >
                    {FAQ_CATEGORIES[activeCategory].items.map((item) => (
                        <FaqAccordionItem key={item.question} {...item} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}