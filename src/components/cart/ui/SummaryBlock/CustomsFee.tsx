"use client";

import InfoSvg from "@/components/ui/icons/InfoSvg";
import { formatPrice } from "@/lib/formatPrice";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CustomsFee({ customsFee }: { customsFee: number }) {
    const [customsFeeOpen, setCustomsFeeOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between text-[var(--text)] text-[14px] leading-[143%]">
                <div className="flex flex-row items-center gap-1">
                    <h3>Customs Fee</h3>
                    <div className="relative">
                        <button
                            className="flex flex-row items-center gap-8"
                            ref={buttonRef}
                            onClick={() => setCustomsFeeOpen(!customsFeeOpen)}
                        >
                            <InfoSvg className="w-4 h-4"/>
                        </button>

                        <AnimatePresence>
                            {customsFeeOpen && (
                                <>
                                    {/* backdrop */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setCustomsFeeOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-[280px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-4"
                                    >
                                        {/* стрелочка */}
                                        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />

                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <InfoSvg className="w-4 h-4 shrink-0 text-gray-400" />
                                                <span className="font-medium text-[13px]">About Customs Fee</span>
                                            </div>
                                            <p className="text-[12px] text-[#666] leading-[160%]">
                                                For UK customers: All orders above £160 are subject to an additional customs fee of £9.95. We take care of all customs and duties so you will not be surprised by any additional charges.
                                            </p>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <span>{formatPrice(customsFee)}</span>
            </div>
        </div>
    );
}