"use client"

import cn from "classnames"
import { motion } from "framer-motion"

interface Props {
    label: string
    checked: boolean
    onChange: () => void
}

export default function FilterCheckbox({ label, checked, onChange }: Props) {
    return (
        <label className="flex items-center gap-3 px-3 rounded-[5px] py-1 hover:bg-gray-50 cursor-pointer transition-colors" onClick={onChange}>
            <div className={cn(
                "w-4 h-4 border rounded-sm flex items-center justify-center shrink-0 transition-colors duration-200",
                {
                    "border-black": checked,
                    "border-gray-300": !checked,
                }
            )}>
                <motion.div
                    initial={false}
                    animate={{ scale: checked ? 1 : 0 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    className="w-2 h-2 bg-black rounded-[2px]"
                />
            </div>
            <span className="text-[14px] text-[var(--text)]">{label}</span>
        </label>
    )
}