import {ProductWithDetails} from "@/types/product-details";
import Image from "next/image";
import {formatPrice} from "@/lib/formatPrice";
import {ProductResult} from "@/actions/search/search";

interface SearchProductCardProps {
    product: ProductResult;
}

export default function SearchProductCard({product}: SearchProductCardProps) {

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-[185/280] w-full max-w-[185px]">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="rounded-[6px] object-cover"
                />
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[var(--text)] text-[16px] font-[600]">{product.name}</span>
                <div>
                    {product.discountPrice ? (
                            <div className="flex items-center gap-2">
                                <span className="text-[16px] text-[var(--text)] font-[600]">{formatPrice(Number(product.discountPrice))}</span>
                                <span className="text-[16px] text-[var(--muted)] line-through font-[600]">{formatPrice(Number(product.originalPrice))}</span>
                            </div>
                        ) :
                        (
                            <span className="text-[16px] text-[var(--text)] font-[600]">{formatPrice(Number(product.originalPrice))}</span>
                        )}

                </div>
            </div>
        </div>
    )
}