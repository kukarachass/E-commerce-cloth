import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Arrow from "@/components/ui/icons/Arrow";
import { formatPrice } from "@/lib/formatPrice";

export default function CheckoutItemsList() {
    const [showItems, setShowItems] = useState(false);

    const items = [
        { id: 1, name: "ORIGINALS LEOPARD FIREBIRD TRACK PANTS", price: 89 },
        { id: 2, name: "CLASSIC TREFOIL HOODIE OVERSIZED", price: 124 },
        { id: 3, name: "NMD R1 PRIMEBLUE RUNNING SHOES", price: 156 },
        { id: 4, name: "TIRO 23 LEAGUE TRAINING JACKET", price: 67 },
        { id: 5, name: "ULTRABOOST 22 RUNNING SHOES", price: 210 },
        { id: 6, name: "ESSENTIALS FLEECE 3-STRIPES PANTS", price: 54 },
    ]

    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-2">
                    <span className="text-[var(--text)] text-[14px] leading-[143%]">Total items (6)</span>
                    <button onClick={() => setShowItems(!showItems)}>
                        <Arrow />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showItems && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-1 px-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex flex-row justify-between items-center gap-4">
                                    <div className="flex flex-row items-center gap-2 min-w-0">
                                        <span className="text-[var(--text)] text-[12px] shrink-0">•</span>
                                        <span className="text-[#666] text-[12px] truncate">{item.name}</span>
                                    </div>
                                    <span className="text-[var(--text)] text-[12px] shrink-0">{formatPrice(item.price)}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}