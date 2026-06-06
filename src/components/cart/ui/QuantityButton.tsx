"use client"

import { CartItemWithDetails } from "@/types/cart"
import { useAddToCart } from "@/hooks/cart/useAddToCart"
import { useSubtractFromCart } from "@/hooks/cart/useSubtractFromCart"

interface QuantityButtonProps {
    cartItem: CartItemWithDetails
}

export default function QuantityButton({ cartItem }: QuantityButtonProps) {
    const { mutate: add, isPending: isAdding } = useAddToCart()
    const { mutate: subtract, isPending: isSubtracting } = useSubtractFromCart()
    const isPending = isAdding || isSubtracting

    return (
        <div className="flex flex-row items-center gap-0 border border-[#e8e8e8] rounded-[8px] overflow-hidden w-fit">
            <button
                onClick={() => subtract({ cartItemId: cartItem.id, quantity: cartItem.quantity - 1 })}
                disabled={isPending}
                className="w-8 h-8 flex items-center justify-center text-[#999] hover:bg-[#f5f5f5] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
                <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                    <path d="M1 1H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>

            <div className="w-8 h-8 flex items-center justify-center border-x border-[#e8e8e8]">
                {isPending ? (
                    <div className="w-3 h-3 border border-[#ccc] border-t-[#999] rounded-full animate-spin" />
                ) : (
                    <span className="text-[13px] font-semibold text-[var(--text)] leading-none tabular-nums">
                        {cartItem.quantity}
                    </span>
                )}
            </div>

            <button
                onClick={() => add({ productId: cartItem.productId, productSizeId: cartItem.productSizeId, quantity: 1 })}
                disabled={isPending || cartItem.quantity >= cartItem.productSize.stockAmount}
                className="w-8 h-8 flex items-center justify-center text-[#999] hover:bg-[#f5f5f5] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1V9M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>
        </div>
    )
}