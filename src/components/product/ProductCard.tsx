"use client"

import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";
import { ProductWithDetails } from "@/types/product-details";
import AddToFavButton from "@/components/favourites/AddToFavButton";
import { useRouter } from "next/navigation";

interface IProductCardProps {
    product: ProductWithDetails;
}

export default function ProductCard({ product }: IProductCardProps) {
    const router = useRouter();
    const salePrice = Number(product.originalPrice);
    const retailPrice = 195; // TODO: заменить на product.retailPrice
    const discountPct = retailPrice > salePrice
        ? Math.round(((retailPrice - salePrice) / retailPrice) * 100)
        : 0;

    return (
        <div
            onClick={() => router.push(`/product/${product.slug}`)}
            className="group flex flex-col gap-3 w-[170px] shrink-0 cursor-pointer"
        >
            {/* ── Image ── */}
            <div className="relative w-[170px] h-[270px] overflow-hidden bg-neutral-100 rounded-[8px]">
                <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="170px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />

                <AddToFavButton className="absolute top-2 right-2" id={product.id} type="product" />

                {discountPct > 0 && (
                    <span className="
                        absolute top-2 left-2
                        text-[10px] font-bold rounded-[4px] tracking-[0.08em]
                        bg-black text-white
                        px-[6px] py-[2px]
                    ">
                        −{discountPct}%
                    </span>
                )}
            </div>

            {/* ── Info ── */}
            <div className="flex flex-col gap-[5px]">
                <p className="
                    text-[14px] font-medium tracking-[0.03em] leading-[1.45]
                    text-[var(--text)] line-clamp-2
                    transition-opacity duration-200 group-hover:opacity-60
                ">
                    {product.name}
                </p>

                <div className="flex items-baseline gap-[6px]">
                    <span className="text-[14px] font-semibold tracking-[0.01em] text-[var(--text)]">
                        {formatPrice(salePrice)}
                    </span>
                    <span className="text-[13px] tracking-[0.01em] text-neutral-400 line-through">
                        {formatPrice(retailPrice)}
                    </span>
                </div>
            </div>
        </div>
    );
}