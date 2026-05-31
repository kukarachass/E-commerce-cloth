"use client"

import Image from "next/image";
import {formatPrice} from "@/lib/formatPrice";
import {useFavoritesStore} from "@/store/useFavoritesStore";
import Link from "next/link";
import {ProductWithDetails} from "@/types/product-details";
import AddToFavButton from "@/components/favourites/AddToFavButton";

export default function CatalogProductCard({ product }: {product: ProductWithDetails }) {
    const sizes = product.sizes.length > 5
        ? `${product.sizes.length} available`
        : product.sizes.map(s => s.size)
    const toggleFavorites = useFavoritesStore(s => s.toggle);
    const isFavorite = useFavoritesStore(s => s.items.includes(product.id));

    const handleFav = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }
    console.log(product.images)

    return(
        <Link href={`/product/${product.id}`} className="flex flex-col gap-4 ">
            <div className="group relative w-[290px] h-[435px]">
                <Image className="rounded"     src={product.images[0]?.url ?? "/placeholder.jpg"}
                       alt={product.name} fill/>
                <AddToFavButton onClick={(e) => handleFav(e)} className={"absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-[18px] h-[18px]"} id={product.id} type={"product"}/>

                {/*<button*/}
                {/*    onClick={(e) => handleFav(product.id, e)}*/}
                {/*    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/60 backdrop-blur-sm rounded-full p-2"*/}
                {/*>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"*/}
                {/*         fill={isFavorite ? "currentColor" : "none"}*/}
                {/*         stroke="currentColor" strokeWidth="2">*/}
                {/*        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}
            </div>
            <div className="flex flex-col gap-1 text-[var(--text)] text-[16px]">
                <span className="font-bold leading-[150%]">{product.name}</span>
                <span className="leading-[143%]">{product.description}</span>
                <span className="leading-[150%] font-[600]">{formatPrice(Number(product.originalPrice))}</span>
                <span className="leading-[143%] text-[#999]">{Array.isArray(sizes) ? sizes.join(" / ") : sizes}</span>
                <span className="leading-[143%]">{product.brand.name}</span>

            </div>
        </Link>
    )
}