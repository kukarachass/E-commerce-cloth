"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {queryKeys} from "@/lib/queryKeys";
import {AddProductToCart} from "@/actions/cart/quantity-actions/add-to-cart";
import { authClient } from "@/lib/auth-client"
import {toast} from "sonner";

interface AddToCartVariables {
    productId: string
    productSizeId: string
    quantity: number
}

export function useAddToCart() {
    const queryClient = useQueryClient()
    const { data: session } = authClient.useSession()
    const userId = session?.user?.id ?? null

    return useMutation({
        mutationFn: ({ productId, productSizeId, quantity }: AddToCartVariables) =>
            AddProductToCart({ userId, productId, productSizeId, quantity }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.cart })
            toast.success("Added to cart")
        },
    })
}