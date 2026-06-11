"use client"

import Image from "next/image";
import {formatPrice} from "@/lib/formatPrice";
import Link from "next/link";
import {ProductWithDetails} from "@/types/product-details";
import AddToFavButton from "@/components/favourites/AddToFavButton";

export default function CatalogProductCard({ product }: {product: ProductWithDetails }) {
    const sizes = product.sizes.length > 5
        ? `${product.sizes.length} available`
        : product.sizes.map(s => s.size)

    const handleFav = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }
    console.log(product.images)

    return(
        <Link href={`/product/${product.slug}`} className="flex flex-col gap-4 ">
            <div className="group relative w-[290px] h-[435px]">
                <Image className="rounded"     src={product.images[0]?.url ?? "/placeholder.jpg"}
                       alt={product.name} fill/>
                <AddToFavButton onClick={(e) => handleFav(e)} className={"absolute top-2 right-2 w-[18px] h-[18px]"} id={product.id} type={"product"}/>
            </div>
            <div className="flex flex-col gap-1 text-[var(--text)] text-[16px]">
                <span className="font-bold leading-[150%]">{product.name}</span>
                <span className="leading-[143%]">Morro bay stripes slipper wmn oyster gray</span>
                <span className="leading-[150%] font-[600]">{formatPrice(Number(product.originalPrice))}</span>
                <span className="leading-[143%] text-[#999]">{Array.isArray(sizes) ? sizes.join(" / ") : sizes}</span>
            </div>
        </Link>
    )
}