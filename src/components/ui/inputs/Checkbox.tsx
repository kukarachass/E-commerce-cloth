"use client"

import { useState } from "react"
import cn from "classnames"
import { motion } from "framer-motion"

interface CheckboxProps {
    label: string
    defaultChecked?: boolean
    checked: boolean
    setChecked: (checked: boolean) => void
}

export default function Checkbox({ checked, setChecked, label, defaultChecked = false }: CheckboxProps) {
    return (
        <label className="flex items-center gap-3 cursor-pointer" onClick={() => setChecked(!checked)}>
            <div className={cn(
                "w-5 h-5 border-2 rounded-sm flex items-center justify-center shrink-0 transition-colors duration-200",
                {
                    "border-black": checked,
                    "border-gray-300": !checked,
                }
            )}>
                <motion.div
                    animate={{ scale: checked ? 1 : 0 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    className="w-2 h-2 bg-black rounded-[2px]"
                />
            </div>
            <span className="text-[16px] text-[var(--text)]">{label}</span>
        </label>
    )
}
