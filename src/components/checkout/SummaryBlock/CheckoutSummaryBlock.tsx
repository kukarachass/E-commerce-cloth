"use client";

import CheckoutItemsList from "@/components/checkout/SummaryBlock/CheckoutItemsList";
import CustomsFee from "@/components/cart/ui/SummaryBlock/CustomsFee";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import Trustpilot from "@/components/ui/icons/Trustpilot";
import {useRouter, useSearchParams} from "next/navigation";
import {formatPrice} from "@/lib/formatPrice";
import {useGetCart} from "@/hooks/cart/useGetCart";
import {toast} from "sonner";
import Arrow from "@/components/ui/icons/Arrow";
import {useState} from "react";

export default function CheckoutSummaryBlock({ href }: { href: string }) {
    const {data: cart, isPending, isError} = useGetCart()

    const searchParams = useSearchParams();
    const router = useRouter();
    const step = Number(searchParams.get("step")) || 1
    const [showItems, setShowItems ] = useState(false);

    if (isPending) return <>Loading...</>
    if (isError) return <div className="text-center text-[#999] py-20">Something went wrong</div>
    if (!cart) {
        toast.error("Your cart is empty")
        return;
    }

    const buttonTitles: Record<number, string> = {
        1: "Continue to payment",
        2: "Order and Pay",
    }

    const providers = [
        { path: "/card-prov/SVG.svg"},
        { path: "/card-prov/SVG-1.svg"},
        { path: "/card-prov/SVG-2.svg"},
        { path: "/card-prov/SVG-3.svg"},
        { path: "/card-prov/SVG-4.svg"},
    ]

    return(
        <div className="max-w-[400px] flex flex-col gap-8 w-full sticky h-fit top-[100px]">
            <div className="flex flex-col gap-6 p-6 bg-[#f9f9f9] rounded-[10px]">
                <div className="flex flex-col gap-4">
                    <h3 className="text-[var(--text)] text-[20px] font-bold">Order summary</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between">
                                <span>{formatPrice(Number(cart.totalAmount))}</span>
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="text-[var(--text)] text-[14px] leading-[143%]">Total items (6)</span>
                                        <button onClick={() => setShowItems(!showItems)}>
                                            <Arrow />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <CheckoutItemsList showItems={showItems} items={cart.items} />
                        </div>
                        <div className="flex flex-row justify-between items-center text-[var(--text)] text-[14px] leading-[143%]">
                            <span>Shipping Fee</span>
                            <span>{formatPrice(Number(cart.shippingFee))}</span>
                        </div>
                        <CustomsFee customsFee={cart.customsFee}/>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-[#f0f0f0]"/>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-center text-[var(--text)] text-[16px] leading-[150%] font-bold">
                        <h3>Total Amount</h3>
                        <span>{formatPrice(Number(cart.grandTotal))}</span>
                    </div>
                    <div className="flex flex-row justify-between items-center text-[var(--text)] text-[14px] leading-[114%]">
                        <span>Total saved</span>
                        <span>{formatPrice(Number(cart.totalSaved))}</span>
                    </div>
                    <div className="text-[var(--text)] text-[12px] leading-[133%]">
                        This is compared to the recommended retail price. This is the
                        price set by the manufacturer, converted into GBP where
                        applicable.
                    </div>
                </div>

                <div className="h-[1px] w-full bg-[#f0f0f0]"/>

                <div className="flex items-center justify-center w-full">
                    <ButtonPrimary onClick={() => router.push(href)} className="w-full" variant={"primary"}>
                        {buttonTitles[step]}
                    </ButtonPrimary>
                </div>
                <div className="flex flex-row items-center justify-center">
                    {providers.map(prov => (
                        <Image key={prov.path} src={prov.path} alt={prov.path} width={46} height={24}/>
                    ))}
                </div>
                
                <Link className="text-center underline text-[#666] text-[14px]" href={"/cart"}> Back to shopping cart</Link>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 9.077L5.949 14L15 5" stroke="#00AA66" strokeWidth="2" />
                    </svg>
                    <span className="text-[var(--text)] text-[16px] font-bold">New deals weekly</span>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 9.077L5.949 14L15 5" stroke="#00AA66" strokeWidth="2" />
                    </svg>
                    <span className="text-[var(--text)] text-[16px] font-bold">New deals weekly</span>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 9.077L5.949 14L15 5" stroke="#00AA66" strokeWidth="2" />
                    </svg>
                    <span className="text-[var(--text)] text-[16px] font-bold">New deals weekly</span>
                </div>
                <Trustpilot/>
            </div>
        </div>
    )
}