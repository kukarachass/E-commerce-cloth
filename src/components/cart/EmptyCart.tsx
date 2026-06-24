"use client"

import {useRouter} from "next/navigation";
import CartTitle from "@/components/cart/ui/CartTitle";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import {ProductWithDetails} from "@/types/product-details";
import ProductsRelated from "@/components/product/ProductsRelated";

export default function EmptyCart({ products }: { products?: ProductWithDetails[]}) {
    if(!products) return <>No products</>
    const router = useRouter();
    return (
        <div className="max-w-[1200px] mx-auto py-10 min-h-screen">
            <div className="flex flex-col gap-6 items-center">
                <div className="flex flex-col gap-2">
                    <CartTitle/>
                    <span className="text-center text-[var(--text)] text-[16px]">It looks like your shopping cart is still empty</span>
                </div>
                <ButtonPrimary onClick={() => router.push("/")} variant={"primary"}>
                    Start shopping
                </ButtonPrimary>

                <ProductsRelated type={"related"} products={products} />
            </div>
        </div>
    )
}