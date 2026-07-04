import { formatPrice } from "@/lib/formatPrice";
import { CartWithConfig } from "@/types/cart";

interface FreeShippingProgressProps {
    cart: CartWithConfig;
}

export default function FreeShippingProgress({ cart }: FreeShippingProgressProps) {
    const { grandTotal, freeShippingThreshold } = cart;
    const currentAmount = Number(grandTotal);
    const threshold = Number(freeShippingThreshold);
    const remaining = Math.max(threshold - currentAmount, 0)
    const progress = Math.min((currentAmount / threshold) * 100, 100)
    const isFree = remaining === 0

    return (
        <div className="flex flex-col gap-1 max-w-[544px] w-full mx-auto">
            <div className="flex flex-row flex-wrap justify-between items-center gap-x-2 gap-y-1">
                <div className="flex flex-row items-center gap-2 min-w-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <path d="M1 3H15V17H1V3Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M15 8H18L21 11V17H15V8Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="5.5" cy="18.5" r="1.5" stroke="black" strokeWidth="1.5" />
                        <circle cx="18.5" cy="18.5" r="1.5" stroke="black" strokeWidth="1.5" />
                    </svg>
                    <span className="font-bold text-[12px] sm:text-[13px]">
                        {isFree
                            ? "You have free shipping!"
                            : `Only ${formatPrice(remaining)} away from free shipping`
                        }
                    </span>
                </div>
                <span className="text-[12px] sm:text-[13px] text-[#999] shrink-0">
                    {formatPrice(currentAmount)} / {formatPrice(threshold)}
                </span>
            </div>

            <div className="w-full h-[4px] bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}