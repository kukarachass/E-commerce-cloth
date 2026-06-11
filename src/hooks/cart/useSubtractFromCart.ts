"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {authClient} from "@/lib/auth-client"
import {SubtractFromCart} from "@/actions/cart/quantity-actions/subtract-from-cart";
import {queryKeys} from "@/lib/queryKeys";

interface SubtractFromCartVariables {
    cartItemId: string
    quantity: number
}

export function useSubtractFromCart() {
    const queryClient = useQueryClient()
    const { data: session } = authClient.useSession()
    const userId = session?.user?.id ?? null

    return useMutation({
        mutationFn: ({ cartItemId, quantity }: SubtractFromCartVariables) =>
            SubtractFromCart({ userId, cartItemId, quantity }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.cart })
        },
    })
}