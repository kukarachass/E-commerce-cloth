"use client"

import { useCheckout } from "@/store/useCheckout"
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary"

export default function CheckoutButton() {
    const submit = useCheckout((s) => s.submit)
    const isPending = useCheckout((s) => s.isPending)
    const error = useCheckout((s) => s.error)

    return (
        <div className="flex flex-col gap-2 w-full">
            <ButtonPrimary
                variant="primary"
                onClick={() => submit?.()}
                disabled={isPending || !submit}
            >
                {isPending ? "Processing..." : "Checkout"}
            </ButtonPrimary>
            {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
    )
}