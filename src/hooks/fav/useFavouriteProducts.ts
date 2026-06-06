"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getFavouriteProducts, toggleFavouriteProduct } from "@/actions/favourites/favourite-product"
import { toast } from "sonner"
import {useCallback} from "react";

export default function useFavouriteProducts() {
    const queryClient = useQueryClient()

    const { data: favProducts = [] } = useQuery({
        queryKey: ["favourite-products"],
        queryFn: async () => {
            const result = await getFavouriteProducts()
            return result ?? []
        },
    })

    const { mutate: toggleFavMutate } = useMutation({
        mutationFn: (productId: string) => toggleFavouriteProduct({ productId }),
        onSuccess: async (data) => {
            if (data?.action === "added") {
                toast.success("Added to favourites")
            } else if (data?.action === "removed") {
                toast.success("Removed from favourites")
            }
            await queryClient.invalidateQueries({ queryKey: ["favourite-products"] })
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    })

    const toggleFav = useCallback((productId: string) => {
        toggleFavMutate(productId)
    }, [toggleFavMutate])

    const isFavourite = useCallback((productId: string) =>
            favProducts?.some(p => p.productId === productId) ?? false,
        [favProducts])

    return { favProducts, toggleFav, isFavourite }
}