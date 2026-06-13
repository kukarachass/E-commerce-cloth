import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary"
import { IOrder } from "@/types/IOrder"
import Link from "next/link"

export default function SuccessPaidPage({ order }: { order: IOrder }) {
    const steps = [
        {
            title: "Confirmation sent",
            description: <>We've sent a confirmation to <span className="font-semibold text-[var(--text)]">{order.email}</span></>
        },
        {
            title: "Packing your order",
            description: "We're carefully packing your items. You'll receive a tracking number once your order is on its way."
        },
        {
            title: "Delivery",
            description: "Estimated delivery in 4–8 working days. Your order may arrive in separate packages."
        },
    ]

    return (
        <div className="max-w-[640px] mx-auto py-16 px-4 flex flex-col gap-10">

            {/* Header */}
            <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 9l4.5 4.5L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h1 className="text-[var(--text)] font-bold text-[32px] leading-[120%]">
                    Order confirmed
                </h1>
                <p className="text-[#999] text-[15px] leading-[160%]">
                    Thanks for your purchase — great taste. We're on it.
                </p>
            </div>

            {/* Order info */}
            <div className="flex flex-col gap-1 p-5 bg-[#f9f9f9] rounded-[12px]">
                <span className="text-[12px] text-[#999] uppercase tracking-wider">Order number</span>
                <span className="text-[var(--text)] font-semibold text-[15px] font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                </span>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-0">
                {steps.map((step, i) => (
                    <div key={i} className="flex flex-row gap-4">
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                                {i + 1}
                            </div>
                            {i < steps.length - 1 && (
                                <div className="w-[1px] flex-1 bg-[#e8e8e8] my-2"/>
                            )}
                        </div>

                        {/* Content */}
                        <div className={`flex flex-col gap-1 ${i < steps.length - 1 ? "pb-6" : ""}`}>
                            <span className="text-[var(--text)] font-semibold text-[14px]">{step.title}</span>
                            <p className="text-[#999] text-[13px] leading-[160%]">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delivery note */}
            <div className="flex flex-row items-center gap-3 p-4 border border-[#ebebeb] rounded-[12px]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#999" strokeWidth="1.2"/>
                    <path d="M8 7v4M8 5.5v.5" stroke="#999" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span className="text-[13px] text-[#999]">Shipping: <span className="font-semibold text-[var(--text)]">4–8 working days</span></span>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3">
                <Link href="/account/orders">
                    <ButtonPrimary className="w-full" variant="primary">
                        View order in My Account
                    </ButtonPrimary>
                </Link>
                <Link href="/" className="text-center text-[13px] text-[#999] hover:text-[var(--text)] transition-colors duration-150">
                    Continue shopping
                </Link>
            </div>
        </div>
    )
}