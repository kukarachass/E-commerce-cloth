"use client"

import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary";
import {useState, useTransition} from "react";
import {AddressSnapshot} from "@/types/IOrder";
import {createCheckout} from "@/actions/checkout/checkout";
import {authClient} from "@/lib/auth-client";
import {useCheckoutStore} from "@/store/useCheckoutAddressStore";

interface CheckoutButtonProps {
    email?: string;
}

const MESSAGES: Record<string, string> = {
    CART_EMPTY: "Cart is empty",
    OUT_OF_STOCK: "One of the items is currently out of stock",
    EMAIL_REQUIRED: "Enter your email address",
    UNKNOWN: "The payment could not be processed. Please try again",
}

export default function CheckoutButton({ email }: CheckoutButtonProps){
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const contactData = useCheckoutStore(s => s.contactData)

    const address: AddressSnapshot = {
        street: contactData?.street ?? "",
        houseNumber: contactData?.houseNumber ?? "",
        houseAddition: contactData?.houseAddition ?? null,
        postcode: contactData?.postcode ?? "",
        city: contactData?.city ?? "",
        country: "Netherlands",
    }

    function handleCheckout(){
        setError(null)
        startTransition(async () => {
            const res = await createCheckout({address, email})
            if (res.ok) {
                window.location.href = res.url   // ВНЕШНИЙ редирект на Stripe
            } else {
                setError(MESSAGES[res.error])
            }
        })
    }
    return(
        <div className="flex flex-col gap-2">
            <ButtonPrimary onClick={handleCheckout} variant={"primary"}>
                {isPending ? "Creating a payment…" : "Proceed to checkout"}
            </ButtonPrimary>
            {error && <p style={{ color: "crimson" }}>{error}</p>}
        </div>

    )
}