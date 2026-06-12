"use client"

import {useState} from "react";
import {motion} from "framer-motion";
import FloatingLabelInput from "@/components/ui/inputs/FloatingLabelInput";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

export default function ContactForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [orderNumber, setOrderNumber] = useState("")
    const [message, setMessage] = useState("")
    const [sent, setSent] = useState(false)

    const handleSubmit = () => {
        if (!name || !email || !message) return
        setSent(true)
    }

    if (sent) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-3 py-12 text-center"
            >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <p className="text-[18px] font-semibold text-[var(--text)]">Message sent!</p>
                <p className="text-[14px] text-[#999]">We'll get back to you within 24 hours.</p>
                <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-[13px] text-[#999] underline cursor-pointer"
                >
                    Send another message
                </button>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingLabelInput label="Your name *" value={name} onChange={(e) => setName(e.target.value)} />
                <FloatingLabelInput label="Email address *" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <FloatingLabelInput label="Order number (optional)" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
            <div className="relative">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Describe your issue..."
                    className="py-3 px-4 w-full text-[14px] border border-[#ccc] rounded-[10px] text-[var(--text)] resize-none outline-none focus:border-black transition-colors"
                />
                {message && (
                    <span className="absolute left-3 -top-2.5 bg-white px-1 rounded text-[12px] text-[var(--text)] font-bold shadow-sm">
                        Message *
                    </span>
                )}
            </div>
            <div>
                <ButtonPrimary variant="primary" onClick={handleSubmit}>
                    Send message
                </ButtonPrimary>
            </div>
        </div>
    )
}