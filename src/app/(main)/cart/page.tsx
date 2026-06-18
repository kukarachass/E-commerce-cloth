"use client"

import EmptyCart from "@/components/cart/EmptyCart"
import Cart from "@/components/cart/Cart"
import {useGetCart} from "@/hooks/cart/useGetCart"
import CartSkeleton from "@/components/cart/ui/CartSkeletonLoader";
import CancelCheckoutWatcher from "@/components/cart/CancelCheckoutWatcher";


export default function CartPage() {
    const {data: cart, isPending, isError} = useGetCart()
    if (isPending) return <CartSkeleton/>
    if (isError) return <div className="text-center text-[#999] py-20">Something went wrong</div>
    if (!cart) return <EmptyCart/>
    if (cart.items.length <= 0) return <EmptyCart/>

    return (
        <div className="w-full">
        {/*<CancelCheckoutWatcher/>*/}
            <div className="max-w-[1200px] mx-auto py-10">
                <div className="flex flex-col gap-4">
                    <Cart cart={cart}/>
                </div>
            </div>
        </div>
    )
}