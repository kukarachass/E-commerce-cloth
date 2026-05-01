"use client"

import {useRouter} from "next/navigation";
import ProductsRelated from "@/components/product/ProductsRelated";
import CartTitle from "@/components/cart/ui/CartTitle";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";

export default function EmptyCart() {
    const products = [
        {
            id: 1,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 2,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 3,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 4,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 5,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 6,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 7,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 8,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 12312,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 432423,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
        {
            id: 4593495,
            name: "product",
            imageUrl: "/prodcard.webp",
            price: 100
        },
    ]
    const router = useRouter();
    return (
        <div className="flex flex-col gap-10 items-center">
            <div className="flex flex-col gap-2">
                <CartTitle/>
                <span className="text-center text-[var(--text)] text-[16px]">It looks like your shopping cart is still empty</span>
            </div>
            <ButtonPrimary onClick={() => router.push("/")} variant={"primary"}>
                Start shopping
            </ButtonPrimary>

            <ProductsRelated products={products} />
        </div>
    )
}