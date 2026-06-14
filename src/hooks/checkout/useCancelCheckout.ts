import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/queryKeys"
import { cancelPendingCheckout } from "@/actions/checkout/cancelPendingCheckout"

export function useCancelCheckout() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (orderId: string) => cancelPendingCheckout(orderId),
        onSuccess: async (res) => {
            await qc.invalidateQueries({ queryKey: queryKeys.order })   // активный pending
            await qc.invalidateQueries({ queryKey: queryKeys.order })  // ← ключ списка из useGetOrders
            if (res.ok) toast.success("Order cancelled")
            else toast.message("This order is no longer pending")
        },
        onError: () => toast.error("Couldn't cancel the order. Please try again."),
    })
}