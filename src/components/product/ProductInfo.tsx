"use client"

import {formatPrice} from "@/lib/formatPrice";
import SizeGuideButton from "@/components/product/size-guide/SizeGuideButton";
import SizeSelector from "@/components/catalog/SizeSelector";
import ProductDescriptionSections from "@/components/product/ProductDescriptionSections";
import {useMiddleBarHeight} from "@/store/useHeaderBarHeightStore";
import AddToFavButton from "@/components/favourites/AddToFavButton";
import AddProductButton from "@/components/product/AddProductButton";
import {ProductWithDetails} from "@/types/product-details";
import {useState} from "react";
import {ProductSize} from "@/types/cart";

export default function ProductInfo({product}: { product: ProductWithDetails }) {
    const advantages = ["New deals weekly", "Shipping: 4-8 working days", "Easy returns within 30 days"]
    const top = useMiddleBarHeight(s => s.middleBarHeight);
    const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)

    return (
        <div className={`flex flex-col gap-6 sticky top-[${top}px]`}>
            <div className="flex flex-col gap-2 text-[var(--text)]">
                <h1 className="text-[34px] leading-[121%] font-bold">{product.name}</h1>
                <span className={"text-[14px] leading-[143%] font-[600] capitalize"}>Marciano by guess pat long skirt sandy shore</span>
                <div>
                    {product.discountPrice ? (
                        <div className="flex flex-col gap-1">
                            <span className="text-[20px] leading-[120%] font-bold">{formatPrice(Number(product.discountPrice))}</span>
                            <span className="text-[12px]">{formatPrice(Number(product.originalPrice))}. This is the price set by the manufacturer, converted into EUR where applicable.</span>
                        </div>
                    ): (
                        <span className="text-[20px] leading-[120%] font-bold">{formatPrice(Number(product.originalPrice))}</span>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <SizeGuideButton/>
                <SizeSelector
                    sizes={product.sizes}
                    onChange={(size) => setSelectedSize(size)} // ← получаем выбранный размер
                />
                <div className="flex flex-row gap-2">
                    <AddToFavButton id={product.id} type={"product"}/>
                    <AddProductButton
                        disabled={!selectedSize}
                        product={product}
                        selectedSize={selectedSize} // ← передаём вниз
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {advantages.map((advantage) => (
                    <div key={advantage} className="flex flex-row items-center gap-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="black" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                        <span className="text-[var(--text)] text-[14px] leading-[143%]">{advantage}</span>
                    </div>
                ))}
            </div>
            <ProductDescriptionSections product={product}/>
            <div className="flex flex-row items-center gap-2">
                <AddToFavButton id={product.brand.id} type={"brand"}/>
                <span className="text-[var(--text)] font-bold">Follow Brand</span>
            </div>
        </div>
    )
}