"use client"

import { useEffect, useState } from "react"
import EmptyCart from "@/components/cart/EmptyCart"
import Cart from "@/components/cart/Cart"
import { useGetCart } from "@/hooks/cart/useGetCart"
import CartSkeleton from "@/components/cart/ui/CartSkeletonLoader";
import ProductsRelated from "@/components/product/ProductsRelated";
import { useGetProductsRecommendations } from "@/hooks/product/useGetProductsRecommendations";
import { useGender } from "@/hooks/useGender";
import ProductsRelatedSkeleton from "@/components/ui/skeleton-loaders/ProductsRelatedSkeletonLoader";

export default function CartPage() {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const { data: cart, isPending, isError } = useGetCart()
    const gender = useGender()
    const cartItems = cart?.items;
    const { data: recommendations, isLoading: isProductsLoading, isError: isProductsError } = useGetProductsRecommendations({ gender, cartItems });

    // гарантируем идентичный первый рендер на сервере и клиенте
    if (!mounted || isPending) return <CartSkeleton />
    if (isError) return <div className="text-center text-[#999] py-20">Something went wrong</div>
    if (!cart || cart.items.length <= 0) return <EmptyCart products={recommendations} />

    return (
        <div className="w-full">
            <div className="max-w-[1200px] mx-auto py-6 sm:py-10">
                <div className="flex flex-col gap-6 sm:gap-8">
                    <Cart cart={cart} />
                    <div className="px-4 xl:px-0">
                        {isProductsLoading ? (
                            <ProductsRelatedSkeleton />
                        ) : isProductsError || !recommendations ? null : (
                            <ProductsRelated products={recommendations} type={"related"} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}