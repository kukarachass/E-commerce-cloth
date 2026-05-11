import DeleteIcon from "@/components/ui/icons/DeleteIcon";
import Image from "next/image";
import QuantityButton from "@/components/cart/ui/QuantityButton";
import {formatPrice} from "@/lib/formatPrice";
import {IProduct} from "@/components/product/IProduct";

export default function CartItem({cartItem}: {cartItem: IProduct }) {
    return (
        <div className="max-w-[600px] w-full flex flex-col gap-4 p-4 border-y border-gray-200">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-4 items-center">
                    <div className="w-[80px] h-[120px] relative">
                        <Image src={cartItem.imgUrl[0]} alt={cartItem.name} fill/>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <span className="text-[var(--text)] font-bold text-[16px] leading-[150%]">{cartItem.name}</span>
                            <span className="text-[var(--text)] text-[14px] leading-[143%]">{cartItem.description}</span>
                        </div>
                        <div className="flex flex-row gap-1 text-[14px]">
                                <span className="text-[var(--text)]">Size</span>
                                <span className="font-bold text-[var(--text)]">{cartItem.sizes}</span>
                                <span className="font-bold text-[#999]">INT</span>
                        </div>
                    </div>
                </div>
                <div className="w-fit h-fit">
                    <DeleteIcon/>
                </div>
            </div>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-[#999] text-[14px]">Quantity</span>
                    <QuantityButton/>
                </div>
                <div className="flex flex-row gap-2 mt-auto">
                    <span className="text-[var(--text)] font-bold text-[16px] leading-[150%]">{formatPrice(cartItem.price)}</span>
                </div>
            </div>
        </div>
    )
}