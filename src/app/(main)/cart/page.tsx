"use client"

import EmptyCart from "@/components/cart/EmptyCart"
import Cart from "@/components/cart/Cart"
import {useGetCart} from "@/hooks/cart/useGetCart"
import CartSkeleton from "@/components/cart/ui/CartSkeletonLoader";
import ProductsRelated from "@/components/product/ProductsRelated";
import {useGetProductsRecommendations} from "@/hooks/product/useGetProductsRecommendations";
import {useGenderStore} from "@/store/useGenderStore";


export default function CartPage() {
    const {data: cart, isPending, isError} = useGetCart()
    const gender = useGenderStore(s => s.gender);
    const products = cart?.items;
    const { data: recommendations, isLoading: isProductsLoading, isError: isProductsError } = useGetProductsRecommendations({gender, products});
    if (isPending) return <CartSkeleton/>
    if (isError) return <div className="text-center text-[#999] py-20">Something went wrong</div>
    if (!cart) return <EmptyCart products={recommendations}/>
    if (cart.items.length <= 0) return <EmptyCart products={recommendations}/>

    if(!recommendations) return <>Loading...</>

    return (
        <div className="w-full">
        {/*<CancelCheckoutWatcher/>*/}
            <div className="max-w-[1200px] mx-auto py-10">
                <div className="flex flex-col gap-4">
                    <Cart cart={cart}/>
                    <ProductsRelated products={recommendations} type={"related"}/>
                </div>
            </div>
        </div>
    )
}