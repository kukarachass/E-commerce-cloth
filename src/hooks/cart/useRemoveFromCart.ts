"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {authClient} from "@/lib/auth-client"
import {RemoveCartItem} from "@/actions/cart/quantity-actions/remove-from-cart";
import {queryKeys} from "@/lib/queryKeys";
import {toast} from "sonner";

interface RemoveCartItemVariables {
    cartItemId: string
}

export function useRemoveCartItem() {
    const queryClient = useQueryClient()
    const { data: session } = authClient.useSession()
    const userId = session?.user?.id ?? null

    return useMutation({
        mutationFn: ({ cartItemId }: RemoveCartItemVariables) =>
            RemoveCartItem({ userId, cartItemId }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.cart })
            toast.success("Removed from cart")
        },
    })
}