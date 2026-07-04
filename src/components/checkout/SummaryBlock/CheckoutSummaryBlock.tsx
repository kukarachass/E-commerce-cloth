"use client"

import CheckoutItemsList from "@/components/checkout/SummaryBlock/CheckoutItemsList"
import CustomsFee from "@/components/cart/ui/SummaryBlock/CustomsFee"
import Image from "next/image"
import Link from "next/link"
import Trustpilot from "@/components/ui/icons/Trustpilot"
import { formatPrice } from "@/lib/formatPrice"
import { useGetCart } from "@/hooks/cart/useGetCart"
import Arrow from "@/components/ui/icons/Arrow"
import { useState } from "react"
import CheckoutButton from "@/components/checkout/CheckoutButton"
import CheckoutSummarySkeletonLoader from "@/components/ui/skeleton-loaders/CheckoutSummaryLoader"

export default function CheckoutSummaryBlock() {
    const { data: cart, isPending, isError } = useGetCart()
    const [showItems, setShowItems] = useState(false)

    if (isPending) return <CheckoutSummarySkeletonLoader />
    if (isError) return <div className="text-center text-[#999] py-20">Something went wrong</div>
    if (!cart) return <div className="text-center text-[#999] py-20">Your cart is empty</div>

    const providers = [
        { path: "/card-prov/SVG.svg" },
        { path: "/card-prov/SVG-1.svg" },
        { path: "/card-prov/SVG-2.svg" },
        { path: "/card-prov/SVG-3.svg" },
        { path: "/card-prov/SVG-4.svg" },
    ]

    return (
        <div className="max-w-full lg:max-w-[400px] flex flex-col gap-6 sm:gap-8 w-full lg:sticky h-fit lg:top-[100px]">
            <div className="flex flex-col gap-5 sm:gap-6 p-5 sm:p-6 bg-[#f9f9f9] rounded-[10px]">
                <div className="flex flex-col gap-4">
                    <h3 className="text-[var(--text)] text-[18px] sm:text-[20px] font-bold">Order summary</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between gap-2">
                                <span className="shrink-0">{formatPrice(Number(cart.totalAmount))}</span>
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex flex-row items-center gap-2">
                                        <span className="text-[var(--text)] text-[13px] sm:text-[14px] leading-[143%] whitespace-nowrap">
                                            Total items ({cart.items.length})
                                        </span>
                                        <button onClick={() => setShowItems(!showItems)}>
                                            <Arrow />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <CheckoutItemsList showItems={showItems} items={cart.items} />
                        </div>
                        <div className="flex flex-row justify-between items-center text-[var(--text)] text-[13px] sm:text-[14px] leading-[143%]">
                            <span>Shipping Fee</span>
                            {cart.isShippingFree ? (
                                <span className="text-[var(--text)] text-[13px] sm:text-[14px]">You've unlocked free shipping</span>
                            ) : (
                                <span>{formatPrice(Number(cart.shippingFee))}</span>
                            )}
                        </div>
                        <CustomsFee customsFee={cart.customsFee} />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-[#f0f0f0]" />

                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between items-center text-[var(--text)] text-[15px] sm:text-[16px] leading-[150%] font-bold">
                        <h3>Total Amount</h3>
                        <span>{formatPrice(Number(cart.grandTotal))}</span>
                    </div>
                    <div className="flex flex-row justify-between items-center text-[var(--text)] text-[13px] sm:text-[14px] leading-[114%]">
                        <span>Total saved</span>
                        <span>{formatPrice(Number(cart.totalSaved))}</span>
                    </div>
                    <div className="text-[var(--text)] text-[11px] sm:text-[12px] leading-[133%]">
                        This is compared to the recommended retail price. This is the
                        price set by the manufacturer, converted into GBP where
                        applicable.
                    </div>
                </div>

                <div className="h-[1px] w-full bg-[#f0f0f0]" />

                <div className="flex items-center w-full">
                    <CheckoutButton />
                </div>
                <div className="flex flex-row items-center justify-center flex-wrap gap-1">
                    {providers.map(prov => (
                        <Image key={prov.path} src={prov.path} alt={prov.path} width={40} height={22} className="sm:w-[46px] sm:h-[24px]" />
                    ))}
                </div>

                <Link className="text-center underline text-[#666] text-[13px] sm:text-[14px]" href={"/cart"}>
                    Back to shopping cart
                </Link>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="shrink-0">
                        <path d="M1 9.077L5.949 14L15 5" stroke="#00AA66" strokeWidth="2" />
                    </svg>
                    <span className="text-[var(--text)] text-[14px] sm:text-[16px] font-bold">New deals weekly</span>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="shrink-0">
                        <path d="M1 9.077L5.949 14L15 5" stroke="#00AA66" strokeWidth="2" />
                    </svg>
                    <span className="text-[var(--text)] text-[14px] sm:text-[16px] font-bold">New deals weekly</span>
                </div>
                <div className="flex flex-row items-center gap-4">
                    <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="shrink-0">
                        <path d="M1 9.077L5.949 14L15 5" stroke="#00AA66" strokeWidth="2" />
                    </svg>
                    <span className="text-[var(--text)] text-[14px] sm:text-[16px] font-bold">New deals weekly</span>
                </div>
                <Trustpilot />
            </div>
        </div>
    )
}