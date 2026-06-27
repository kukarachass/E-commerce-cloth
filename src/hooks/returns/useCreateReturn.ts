import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryKeys } from "@/lib/queryKeys"
import { createReturn } from "@/actions/returns/createReturn"

export function useCreateReturn() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createReturn,
        onSuccess: async (res) => {
            if (res.ok) await qc.invalidateQueries({ queryKey: queryKeys.returnableOrders })
            else toast.error("Couldn’t create the return. Please try again.")
        },
        onError: () => toast.error("Something went wrong. Please try again."),
    })
}