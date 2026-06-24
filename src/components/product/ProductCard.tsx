import Image from "next/image";
import {formatPrice} from "@/lib/formatPrice";
import Link from "next/link";
import {ProductWithDetails} from "@/types/product-details";

interface IProductCardProps {
    product: ProductWithDetails;
}

export default function ProductCard({ product }: IProductCardProps) {
    return(
        <Link href={`/product/${product.slug}`} className="max-w-[180px] h-full w-full">
            <div className="flex flex-col gap-4">
                <div className="w-[180px] h-[270px] relative">
                    <Image src={product.images[0].url} alt={"product"} fill className="object-cover rounded-[4px]"/>
                </div>
                <div className="flex flex-col">
                    <span className="text-[var(--text)] text-[16px] leading-[150%] font-bold">{product.name}</span>
                    <div className="flex flex-row items-center gap-1">
                        <span className="text-[var(--text)] text-[16px] font-bold leading-[150%]">{formatPrice(Number(product.originalPrice))}</span>
                        <span className="text-[#666] text-[16px] font-bold leading-[150%]">{formatPrice(195)}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}