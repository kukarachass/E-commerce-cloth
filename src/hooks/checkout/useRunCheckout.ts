import { useCallback } from "react"
import { createCheckout } from "@/actions/checkout/checkout"
import { useCheckout } from "@/store/useCheckout"
import { CHECKOUT_MESSAGES } from "@/lib/checkout/messages"
import type { AddressSnapshot } from "@/types/IOrder"

// ТОЛЬКО финальный шаг: создать оплату → редирект (успех) или fail (ошибка).
// На успехе pending НЕ сбрасываем — браузер уходит на Stripe.
export function useRunCheckout() {
    const fail = useCheckout((s) => s.fail)

    return useCallback(
        async function run(args: { address: AddressSnapshot; email?: string }) {
            const res = await createCheckout(args)
            if (res.ok) {
                window.location.href = res.url
            } else {
                fail(CHECKOUT_MESSAGES[res.error] ?? CHECKOUT_MESSAGES.UNKNOWN)
            }
        },
        [fail],
    )
}