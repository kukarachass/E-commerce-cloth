"use client"
import { useState } from "react"
import Image from "next/image"
import cn from "classnames"
import CardForm from "@/components/checkout/step-2/CardForm"

const paymentMethods = [
    { id: "card", label: "Card", icon: "/payment/card.svg" },
    { id: "klarna", label: "Klarna", icon: "/payment/klarna.svg" },
] as const

type Method = typeof paymentMethods[number]["id"]

export default function PaymentMethod() {
    const [method, setMethod] = useState<Method>("card")
    const cardProviders = [
        { icon: "/payment/prov-1.svg" },
        { icon: "/payment/prov-2.svg" },
        { icon: "/payment/prov-3.svg" },
        { icon: "/payment/prov-4.svg" },
        { icon: "/payment/prov-5.svg" },
    ]

    return (
        <div className="flex flex-col gap-4 w-full">
            <h2 className="font-bold text-[20px] sm:text-[24px]">Payment method</h2>
            <div className="flex flex-col gap-3">
                {paymentMethods.map((m) => (
                    <div key={m.id} className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                            <button
                                onClick={() => setMethod(m.id)}
                                className="flex flex-row items-center gap-3 sm:gap-4"
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                    {
                                        "border-black": method === m.id,
                                        "border-gray-300": method !== m.id,
                                    }
                                )}>
                                    {method === m.id && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                    )}
                                </div>

                                <div className="w-[36px] h-[26px] sm:w-[40px] sm:h-[30px] relative rounded-lg overflow-hidden shrink-0">
                                    <Image src={m.icon} alt={m.label} fill className="object-cover" />
                                </div>

                                <span className="text-[15px] sm:text-[16px] text-[var(--text)] font-medium">{m.label}</span>
                            </button>
                            {m.id === "card" && (
                                <div className="flex flex-row items-center gap-1.5 sm:gap-2 flex-wrap pl-8 sm:pl-0">
                                    {cardProviders.map(prov => (
                                        <Image key={prov.icon} src={prov.icon} alt={prov.icon} width={28} height={20} className="sm:w-8 sm:h-6" />
                                    ))}
                                </div>
                            )}
                        </div>
                        {m.id === "card" && method === "card" && (
                            <CardForm />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}