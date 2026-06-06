import Image from "next/image"
import DeleteIcon from "@/components/ui/icons/DeleteIcon"
import QuantityButton from "@/components/cart/ui/QuantityButton"
import { formatPrice } from "@/lib/formatPrice"
import { CartItemWithDetails } from "@/types/cart"
import DeleteFromCart from "@/components/cart/ui/DeleteFromCart";

export default function CartItem({ cartItem }: { cartItem: CartItemWithDetails }) {
    const { product } = cartItem


    return (
        <div className="flex flex-row gap-3 py-4 border-b border-[#ebebeb]">
            <div className="relative w-[72px] h-[96px] shrink-0 overflow-hidden rounded-[4px] bg-[#f5f5f5]">
                <Image
                    src={product.images[0]?.url ?? ""}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                <div className="flex flex-row justify-between items-start gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[13px] font-semibold leading-[140%] truncate text-[var(--text)]">
                            {product.name}
                        </span>
                        <span className="text-[12px] text-[#999]">
                            Size {cartItem.productSize.size}
                        </span>
                    </div>
                    <DeleteFromCart cartItemId={cartItem.id} />
                </div>

                <div className="flex flex-row items-center justify-between">
                    <QuantityButton cartItem={cartItem}/>
                    <div className="flex flex-col items-end">
                        <span className="text-[13px] font-bold text-[var(--text)]">
                            {cartItem.product.discountPrice && (
                                <div className="flex flex-row gap-2">
                                    <span className={"text-[var(--muted)] line-through"}>{formatPrice(Number(product.originalPrice) * cartItem.quantity)}</span>
                                    {formatPrice(Number(cartItem.priceAtAddition) * cartItem.quantity)}
                                </div>

                            )}
                        </span>
                        {cartItem.quantity > 1 && (
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