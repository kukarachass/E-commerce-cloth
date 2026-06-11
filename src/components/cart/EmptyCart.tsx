"use client"

import {useRouter} from "next/navigation";
import CartTitle from "@/components/cart/ui/CartTitle";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

export default function EmptyCart() {
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

                {/*<ProductsRelated products={products} />*/}
            </div>
        </div>
    )
}