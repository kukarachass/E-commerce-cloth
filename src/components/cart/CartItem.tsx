import Image from "next/image"
import QuantityButton from "@/components/cart/ui/QuantityButton"
import { formatPrice } from "@/lib/formatPrice"
import { CartItemWithDetails } from "@/types/cart"
import DeleteFromCart from "@/components/cart/ui/DeleteFromCart";

export default function CartItem({ cartItem }: { cartItem: CartItemWithDetails }) {
    const { product } = cartItem
    const isOutOfStock = cartItem.productSize.stockAmount === 0

    return (
        <div className="flex flex-row gap-3 py-4 border-b border-[#ebebeb]">
            <div className={`relative w-[64px] h-[86px] sm:w-[72px] sm:h-[96px] shrink-0 overflow-hidden rounded-[4px] bg-[#f5f5f5] ${isOutOfStock ? "opacity-40" : ""}`}>
                <Image
                    src={product.images[0]?.url ?? ""}
                    alt={product.name}
                    fill
                    sizes="72px"
                    className="object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                <div className="flex flex-row justify-between items-start gap-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className={`text-[13px] font-semibold leading-[140%] truncate ${isOutOfStock ? "text-[#bbb]" : "text-[var(--text)]"}`}>
                            {product.name}
                        </span>
                        <div className="flex flex-row items-center gap-2 flex-wrap">
                            <span className="text-[12px] text-[#999]">
                                Size {cartItem.productSize.size}
                            </span>
                            {isOutOfStock && (
                                <span className="text-[11px] text-red-400 font-medium bg-red-50 px-1.5 py-0.5 rounded-[4px]">
                                    Out of stock
                                </span>
                            )}
                        </div>
                    </div>
                    <DeleteFromCart cartItemId={cartItem.id} />
                </div>

                <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
                    {isOutOfStock ? (
                        <span className="text-[12px] text-[#bbb]">
                            This item is no longer available
                        </span>
                    ) : (
                        <QuantityButton cartItem={cartItem} />
                    )}
                    <div className="flex flex-col items-end">
                        <span className={`text-[13px] font-bold ${isOutOfStock ? "text-[#bbb]" : "text-[var(--text)]"}`}>
                            {cartItem.product.discountPrice && (
                                <div className="flex flex-row gap-2">
                                    <span className="text-[var(--muted)] line-through">
                                        {formatPrice(Number(product.originalPrice) * cartItem.quantity)}
                                    </span>
                                    {formatPrice(Number(cartItem.priceAtAddition) * cartItem.quantity)}
                                </div>
                            )}
                        </span>
                        {cartItem.quantity > 1 && isOutOfStock && (
                            <span className="text-[11px] text-[#bbb]">
                                {formatPrice(Number(cartItem.priceAtAddition))} each
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}