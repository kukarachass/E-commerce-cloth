"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput"

export default function ContactForm() {
    const [name, setName]               = useState("")
    const [email, setEmail]             = useState("")
    const [orderNumber, setOrderNumber] = useState("")
    const [message, setMessage]         = useState("")
    const [sent, setSent]               = useState(false)

    const canSubmit = name.trim() && email.trim() && message.trim()

    if (sent) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 rounded-xl border border-neutral-200 bg-white px-6 py-14 text-center"
            >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12.5l4.5 4.5L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-[16px] font-semibold text-neutral-900">Message sent</p>
                    <p className="text-[13px] text-neutral-400">We'll get back to you within 24 hours.</p>
                </div>
                <button
                    onClick={() => setSent(false)}
                    className="mt-1 text-[13px] text-neutral-400 border-b border-neutral-300 hover:border-neutral-600 hover:text-neutral-600 transition-colors pb-px"
                >
                    Send another message
                </button>
            </motion.div>
        )
    }

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingLabelInput
                    label="Your name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <FloatingLabelInput
                    label="Email address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <FloatingLabelInput
                label="Order number (optional)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
            />

            <div className="relative">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Describe your issue…"
                    className={`
                        w-full resize-none rounded-lg border bg-white
                        px-3 py-2.5 text-[13px] text-neutral-900 outline-none
                        placeholder:text-neutral-400 transition-colors
                        ${message ? "border-neutral-300" : "border-neutral-200"}
                        focus:border-neutral-900
                    `}
                />
            </div>

            <div className="flex justify-end pt-1 border-t border-neutral-100">
                <button
                    onClick={() => canSubmit && setSent(true)}
                    disabled={!canSubmit}
                    className="rounded-lg bg-neutral-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Send message
                </button>
            </div>
        </div>
    )
}