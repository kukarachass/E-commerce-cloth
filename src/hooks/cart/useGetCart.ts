"use client"

import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { getCart } from "@/actions/cart/get-cart"
import {queryKeys} from "@/lib/queryKeys";

export function useGetCart() {
    const { data: session, isPending } = authClient.useSession()
    const userId = session?.user?.id ?? null

    return useQuery({
        queryKey: queryKeys.cart,
        queryFn: () => getCart({ userId }),
        enabled: !isPending, // ← ждём пока сессия загрузится
    })
}