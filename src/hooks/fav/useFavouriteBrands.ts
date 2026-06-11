"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { getFavouriteBrands, toggleFavouriteBrand } from "@/actions/favourites/favourite-brand"
import { toast } from "sonner"

export default function useFavouriteBrands() {
    const queryClient = useQueryClient()

    const { data: favBrands = [] } = useQuery({
        queryKey: ["favourite-brands"],
        queryFn: async () => {
            const result = await getFavouriteBrands()
            return result ?? []
        },
    })

    const { mutate: toggleFavMutate } = useMutation({
        mutationFn: (brandId: string) => toggleFavouriteBrand({ brandId }),
        onSuccess: async (data) => {
            if (data?.action === "added") {
                toast.success("Added to favourites")
            } else if (data?.action === "removed") {
                toast.success("Removed from favourites")
            }
            await queryClient.invalidateQueries({ queryKey: ["favourite-brands"] })
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    })

    const toggleFav = useCallback((brandId: string) => {
        toggleFavMutate(brandId)
    }, [toggleFavMutate])

    const isFavourite = useCallback((brandId: string) =>
            favBrands?.some(b => b.id === brandId) ?? false,
        [favBrands])

    return { favBrands, toggleFav, isFavourite }
}