import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/queryKeys"
import { resumeCheckout } from "@/actions/checkout/resumeCheckout"

export function useResumeCheckout() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (orderId: string) => resumeCheckout(orderId),
        onSuccess: async (res) => {
            if (res.ok) {
                window.location.assign(res.url) // уходим на Stripe той же сессией
                return
            }
            // сессия истекла / уже не pending — обновим состояние и подскажем
            await qc.invalidateQueries({ queryKey: queryKeys.order })
            toast.error("This checkout expired. Please start a new order.")
        },
        onError: () => toast.error("Something went wrong. Please try again."),
    })
}