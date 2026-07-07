import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cancelPaidOrder } from "@/actions/returns/cancelPaidOrder"
import { queryKeys } from "@/lib/queryKeys"
import { toast } from "sonner"

export default function useCancelPaidOrder(orderId: string | undefined) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => {
            if (!orderId) throw new Error("orderId is required")
            return cancelPaidOrder({ orderId })
        },
        onSuccess: async (result) => {
            if (result.success && orderId) {
                await queryClient.invalidateQueries({ queryKey: queryKeys.cancelOrders(orderId) })
                toast.success("The order was successfully canceled")
            }
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })
}