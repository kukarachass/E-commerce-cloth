"use client"

import {IProduct} from "@/components/product/IProduct";
import {formatPrice} from "@/lib/formatPrice";
import SizeGuideButton from "@/components/product/size-guide/SizeGuideButton";
import SizeSelector from "@/components/catalog/SizeSelector";
import AddToFavButton from "@/components/product/AddToFavButton";
import AddToBagButton from "@/components/product/AddToBagButton";
import ProductDescriptionSections from "@/components/product/ProductDescriptionSections";
import {useMiddleBarHeight} from "@/store/useHeaderBarHeightStore";
import AddToFavBrandButton from "@/components/product/AddToFavBrandButton";

export default function ProductInfo({ product }: {product: IProduct }){
    const advantages = ["New deals weekly", "Shipping: 4-8 working days", "Easy returns within 30 days"]
    const top = useMiddleBarHeight(s => s.middleBarHeight);
    return(
        <div className={`flex flex-col gap-6 sticky top-[${top}px]`}>
            <div className="flex flex-col gap-2 text-[var(--text)]">
                <h1 className="text-[48px] leading-[121%] font-bold">{product.brand}</h1>
                <span className={"text-[14px] leading-[143%]"}>{product.description}</span>
                <span className="text-[20px] leading-[120%] font-bold">{formatPrice(product.price)}</span>
            </div>
            <div className="flex flex-col gap-2">
                <SizeGuideButton />
                <SizeSelector sizes={product.sizes}/>
                <div className="flex flex-row gap-2">
                    <AddToFavButton productId={product.id}/>
                    <AddToBagButton className="w-full"/>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {advantages.map((advantage) => (
                    <div key={advantage} className="flex flex-row items-center gap-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[var(--text)] text-[14px] leading-[143%]">{advantage}</span>
                    </div>
                ))}
            </div>
            <ProductDescriptionSections product={product}/>
            <AddToFavBrandButton brandId={product.brand}/>
        </div>
    )
}