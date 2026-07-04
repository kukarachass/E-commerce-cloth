"use client"

import EmptyCart from "@/components/cart/EmptyCart"
import Cart from "@/components/cart/Cart"
import { useGetCart } from "@/hooks/cart/useGetCart"
import CartSkeleton from "@/components/cart/ui/CartSkeletonLoader";
import ProductsRelated from "@/components/product/ProductsRelated";
import { useGetProductsRecommendations } from "@/hooks/product/useGetProductsRecommendations";
import { useGender } from "@/hooks/useGender";
import ProductsRelatedSkeleton from "@/components/ui/skeleton-loaders/ProductsRelatedSkeletonLoader";

export default function CartPage() {
    const { data: cart, isPending, isError } = useGetCart()
    const gender = useGender()
    const cartItems = cart?.items;
    const { data: recommendations, isLoading: isProductsLoading } = useGetProductsRecommendations({ gender, cartItems });

    if (isPending) return <CartSkeleton />
    if (isError) return <div className="text-center text-[#999] py-20">Something went wrong</div>
    if (!cart) return <EmptyCart products={recommendations} />
    if (cart.items.length <= 0) return <EmptyCart products={recommendations} />
    if (!recommendations) return <CartSkeleton />
    if(isProductsLoading) return <ProductsRelatedSkeleton/>

    return (
        <div className="w-full">
            <div className="max-w-[1200px] mx-auto py-6 sm:py-10 px-4 xl:px-0">
                <div className="flex flex-col gap-6 sm:gap-8">
                    <Cart cart={cart} />
                    <div className="px-4">
                        <ProductsRelated products={recommendations} type={"related"} />
                    </div>
                </div>
            </div>
        </div>
    )
}