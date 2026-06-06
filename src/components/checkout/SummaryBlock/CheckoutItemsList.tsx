import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Arrow from "@/components/ui/icons/Arrow";
import { formatPrice } from "@/lib/formatPrice";
import {CartItemWithDetails} from "@/types/cart";

interface CheckoutItemsListProps{
    showItems: boolean;
    items: CartItemWithDetails[];
}

export default function CheckoutItemsList({ showItems, items }: CheckoutItemsListProps) {
    const { discountPrice, originalPrice } = items[0].product;
    const finalProductPrice = discountPrice ? discountPrice : originalPrice;

    return (
        <>
            <AnimatePresence>
                {showItems && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-1 p-2">
                            {items.map((item) => (
                                <div key={item.id} className="flex flex-row justify-between items-center gap-4">
                                    <div className="flex flex-row items-center gap-2 min-w-0">
                                        <span className="text-[var(--text)] text-[12px] shrink-0">•</span>
                                        <span className="text-[#666] text-[12px] truncate">{item.product.name}</span>
                                    </div>
                                    <span className="text-[var(--text)] text-[12px] shrink-0">{formatPrice(Number(finalProductPrice))}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}