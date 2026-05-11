"use client"

import Arrow from "@/components/ui/icons/Arrow";
import {useState, useRef} from "react";
import {IProduct} from "@/components/product/IProduct";
import {KlarnaSvg, MastercardSvg, PaypalSvg, VisaSvg} from "@/components/ui/icons/CardProvidersSvgs";

export default function ProductDescriptionSections({product}: {product: IProduct }) {
    const [openSections, setOpenSections] = useState<Set<string>>(new Set([""]))

    const toggle = (key: string) =>
        setOpenSections(prev => {
            const next = new Set(prev)
            next.has(key) ? next.delete(key) : next.add(key)
            return next
        })
    const accordions = [
        {
            title: "Product info",
            key: "product-info"
        },
        {
            title: "Otrium offers",
            key: "otrium-offers"
        },
        {
            title: "Payment, shipping and returns",
            key: "payment"
        },

    ]

    return (
        <div className="flex flex-col">
            {accordions.map((item, index) => {
                const isOpen = openSections.has(item.key)
                return (
                    <div key={item.key}
                         className={`flex flex-col ${index === accordions.length - 1 ? "border-b border-[#d6d0ca]" : ""}`}>
                        <button onClick={() => toggle(item.key)}
                                className="flex flex-row justify-between items-center w-full py-4 border-t border-[#d6d0ca] pr-1">
                            <span
                                className="text-[var(--text)] text-[14px] leading-[171%] font-bold">{item.title}</span>
                            <Arrow
                                className={`w-[12px] h-[12px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}/>
                        </button>
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                            <div className="overflow-hidden">
                                <div className="pb-4">
                                    {item.key === "product-info" && ProductInformation({product})}
                                    {item.key === "payment" && Payment()}
                                    {item.key === "otrium-offers" && Offers()}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function ProductInformation({product}: {product: IProduct }) {
    const {descriptionFull, material, careInstructions} = product;
    return (
        <div className="flex flex-col gap-2 text-[var(--text)]">
            <div className="flex flex-col gap-1">
                <span className="text-[14px] font-bold">Description</span>
                <p className="text-[14px] leading-[171%]">{descriptionFull}</p>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[14px] font-bold">Material</span>
                <p className="text-[14px] leading-[171%]">{material}</p>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[14px] font-bold">Care instructions</span>
                <p className="text-[14px] leading-[171%]">{careInstructions}</p>
            </div>
        </div>
    )
}

function Payment() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between w-full">
                <VisaSvg className={"w-[80px] h-[80px]"}/>
                <MastercardSvg className={"w-[80px] h-[80px]"}/>
                <PaypalSvg className={"w-[80px] h-[80px]"}/>
                <KlarnaSvg className={"w-[80px] h-[80px]"}/>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[var(--text)] text-[14px] font-bold">Shipping</span>
                <p className="text-[14px] leading-[171%]">All orders above £160 are subject to an additional customs fee
                    of £9.95. We take care of all customs and duties so you will not be surprised by any additional
                    charges above this, no matter what you order.</p>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[var(--text)] text-[14px] font-bold">Return in 30 days</span>
                <p className="text-[14px] leading-[171%]">We want you to be happy. To return an item, we make it easy –
                    no printer required. The return costs are £5.95</p>
            </div>
        </div>
    )
}

function Offers() {
    const offers = [
        "30 days return guarantee",
        "Real-time order tracking",
        "100+ brands",
        "Exclusive deals",
    ]

    const CheckIcon = () => (
        <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {offers.map(offer => (
                <div key={offer} className="flex flex-row gap-1 items-center">
                    <CheckIcon/>
                    <span className="text-[var(--text)] shrink-0 text-[13px]">{offer}</span>
                </div>
            ))}
        </div>
    )
}