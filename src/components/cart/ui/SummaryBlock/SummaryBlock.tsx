"use client"

import PromoCodeInput from "@/components/cart/ui/PromoCodeInput";
import {formatPrice} from "@/lib/formatPrice";
import CustomsFee from "@/components/cart/ui/SummaryBlock/CustomsFee";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import Image from "next/image";
import {useRouter} from "next/navigation";

export default function SummaryBlock() {
    const router = useRouter();
    const order = {
        items: 6,
        totalAmount: 455,
        shippingFee: 6.99,
        customsFee: 9.99
    }
    const providers = [
        { path: "/card-prov/SVG.svg"},
        { path: "/card-prov/SVG-1.svg"},
        { path: "/card-prov/SVG-2.svg"},
        { path: "/card-prov/SVG-3.svg"},
        { path: "/card-prov/SVG-4.svg"},
    ]
    return (
        <div className="max-w-[400px] sticky bg-[#f9f9f9] h-fit rounded-[10px] top-[100px]">
            <div className="flex flex-col gap-4 p-6">
                <h1 className="text-[var(--text)] text-[20px] font-bold leading-[120%]">Order Summary</h1>
                <span className="text-[var(--text)] text-[16px] pb-2">Apply promo code</span>
                <PromoCodeInput/>
                <span className="underline text-[var(--text)] text-[14px] leading-[143%]">Promotions FAQ's</span>
            </div>
            <div className="h-[1px] w-full bg-[#f0f0f0]"/>

            <div className="flex flex-col gap-2.5 p-6 w-full">
                <div className="flex flex-row justify-between text-[var(--text)] text-[14px] font-bold leading-[143%]">
                    <h3>Total Items({order.items})</h3>
                    <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex flex-row justify-between text-[var(--text)] text-[14px] leading-[143%]">
                    <h3>Shipping Fee</h3>
                    <span>{formatPrice(order.shippingFee)}</span>
                </div>
                <CustomsFee customsFee={order.customsFee}/>
            </div>

            <div className="h-[1px] w-full bg-[#f0f0f0]"/>
            <div className="flex flex-col gap-2.5 p-6 w-full">
                <div className="flex flex-row justify-between text-[var(--text)] font-bold text-[20px] leading-[120%]">
                    <h3>Total</h3>
                    <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex flex-row justify-between text-[var(--text)] font-bold text-[14px] leading-[143%]">
                    <h3>Total saved</h3>
                    <span>{formatPrice(623)}</span>
                </div>
                <span className="text-[var(--text)] text-[12px] leading-[133%]">This is compared to the recommended retail price. This is the
                        price set by the manufacturer, converted into GBP where
                                applicable.
                </span>
            </div>
            <div className="flex items-center justify-center p-6 w-full">
                <ButtonPrimary onClick={() => router.push("/checkout?step=1")} className="w-full" variant={"primary"}>
                    Continue to checkout
                </ButtonPrimary>
            </div>
            <div className="flex flex-row items-center justify-center pb-6">
                {providers.map(prov => (
                    <Image key={prov.path} src={prov.path} alt={prov.path} width={46} height={24}/>
                ))}
            </div>
        </div>
    )
}