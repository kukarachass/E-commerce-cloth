"use client"

import { formatPrice } from "@/lib/formatPrice"
import SizeGuideButton from "@/components/product/size-guide/SizeGuideButton"
import SizeSelector from "@/components/catalog/SizeSelector"
import ProductDescriptionSections from "@/components/product/ProductDescriptionSections"
import { useMiddleBarHeight } from "@/store/useHeaderBarHeightStore"
import AddToFavButton from "@/components/favourites/AddToFavButton"
import AddProductButton from "@/components/product/AddProductButton"
import { ProductWithDetails } from "@/types/product-details"
import { useState } from "react"
import { ProductSize } from "@/types/cart"

export default function ProductInfo({ product }: { product: ProductWithDetails }) {
    const advantages = ["New deals weekly", "Shipping: 4-8 working days", "Easy returns within 30 days"]
    const middleBarHeight = useMiddleBarHeight(s => s.middleBarHeight)
    const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)

    return (
        <div
            style={{ top: middleBarHeight }}
            className="flex flex-col gap-5 lg:gap-6 lg:sticky lg:self-start"
        >
            <div className="flex flex-col gap-2 text-neutral-900">
                <h1 className="text-[24px] sm:text-[28px] lg:text-[34px] leading-tight font-bold">
                    {product.name}
                </h1>
                <span className="text-[13px] lg:text-[14px] leading-snug font-semibold capitalize text-neutral-500">
                    Marciano by guess pat long skirt sandy shore
                </span>
                <div>
                    {product.discountPrice ? (
                        <div className="flex flex-col gap-1">
                            <span className="text-[18px] lg:text-[20px] leading-tight font-bold">
                                {formatPrice(Number(product.discountPrice))}
                            </span>
                            <span className="text-[12px] text-neutral-400">
                                {formatPrice(Number(product.originalPrice))}. This is the price set by the manufacturer, converted into EUR where applicable.
                            </span>
                        </div>
                    ) : (
                        <span className="text-[18px] lg:text-[20px] leading-tight font-bold">
                            {formatPrice(Number(product.originalPrice))}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <SizeGuideButton />
                <SizeSelector
                    sizes={product.sizes}
                    onChange={(size) => setSelectedSize(size)}
                />
                <div className="flex flex-row gap-2">
                    <AddToFavButton id={product.id} type="product" />
                    <AddProductButton
                        disabled={!selectedSize}
                        product={product}
                        selectedSize={selectedSize}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {advantages.map((advantage) => (
                    <div key={advantage} className="flex flex-row items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <path d="M20 6L9 17L4 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-neutral-900 text-[13px] lg:text-[14px] leading-snug">{advantage}</span>
                    </div>
                ))}
            </div>

            <ProductDescriptionSections product={product} />

            <div className="flex flex-row items-center gap-2">
                <AddToFavButton id={product.brand.id} type="brand" />
                <span className="text-neutral-900 font-bold">Follow Brand</span>
            </div>
        </div>
    )
}