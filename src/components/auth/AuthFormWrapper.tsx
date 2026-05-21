// components/auth/AuthFormWrapper.tsx
"use client"

import { AnimatePresence, motion } from "framer-motion"

interface Props {
    method: "sign-in" | "sign-up"
    children: React.ReactNode
}

export default function AuthFormWrapper({ method, children }: Props) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={method}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}