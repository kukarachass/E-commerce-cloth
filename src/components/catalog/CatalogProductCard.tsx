"use client"

import Image from "next/image"
import { formatPrice } from "@/lib/formatPrice"
import { ProductWithDetails } from "@/types/product-details"
import AddToFavButton from "@/components/favourites/AddToFavButton"
import { useRouter } from "next/navigation"

export default function CatalogProductCard({ product }: { product: ProductWithDetails }) {
    const router = useRouter()
    const sizes = product.sizes.length > 5
        ? `${product.sizes.length} available`
        : product.sizes.map(s => s.size)

    const handleFav = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <div
            onClick={() => router.push(`/product/${product.slug}`)}
            className="flex flex-col gap-1.5 cursor-pointer"
        >
            <div className="group relative w-full aspect-[2/3]">
                <Image
                    className="rounded object-cover"
                    src={product.images[0]?.url ?? "/placeholder.jpg"}
                    alt={product.name}
                    fill
                />
                <AddToFavButton
                    onClick={(e) => handleFav(e)}
                    className="absolute top-1.5 right-1.5 w-[14px] h-[14px]"
                    id={product.id}
                    type="product"
                />
            </div>
            <div className="flex flex-col gap-0.5 text-neutral-900 text-[12px] lg:text-[13px]">
                <span className="font-bold leading-snug line-clamp-1">{product.name}</span>
                <span className="leading-snug font-semibold">
                    {formatPrice(Number(product.originalPrice))}
                </span>
                <span className="leading-snug text-neutral-400 line-clamp-1">
                    {Array.isArray(sizes) ? sizes.join(" / ") : sizes}
                </span>
            </div>
        </div>
    )
}