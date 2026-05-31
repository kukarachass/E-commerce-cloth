import Image from "next/image";
import {formatPrice} from "@/lib/formatPrice";
import {IProduct} from "@/components/product/IProduct";
import Link from "next/link";
import {ProductWithDetails} from "@/types/product-details";

interface IProductCardProps {
    product: ProductWithDetails;
    variant?: "default" | "noButton"
}

export default function ProductCard({ product, variant = "default" }: IProductCardProps) {
    return(
        <Link href={`/product/${product.id}`} className="max-w-[180px] h-full w-full">
            <div className="flex flex-col gap-4">
                <div className="w-[180px] h-[270px] relative">
                    <Image src={"/placeholder.jpg"} alt={"product"} fill className="object-cover rounded-[8px]"/>
                </div>
                <div className="flex flex-col">
                    <span className="text-[var(--text)] text-[16px] leading-[150%] font-bold">{product.name}</span>
                    <div className="flex flex-row items-center gap-1">
                        <span className="text-[var(--text)] text-[16px] font-bold leading-[150%]">{formatPrice(Number(product.originalPrice))}</span>
                        <span className="text-[#666] text-[16px] font-bold leading-[150%]">{formatPrice(195)}</span>
                    </div>
                </div>
                {variant === "default" && (
                    <button className="px-[42px] py-[8px] rounded-[10px] bg-black/[0.04] texe-[var(--text)] text-[16px] font-medium cursor-pointer">
                        Add to bag
                    </button>
                )}
            </div>
        </Link>
    )
}