"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getFavouriteProducts, toggleFavouriteProduct} from "@/actions/favourites/favourite-product";
import {toast} from "sonner";

export default function useFavouriteProducts() {
    const queryClient = useQueryClient();

    const { data: favProducts = [] } = useQuery({
        queryKey: ["favourite-products"],
        queryFn: () => getFavouriteProducts(),
    })

    const { mutate: toggleFav } = useMutation({
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

    const isFavourite = (productId: string) =>
        favProducts?.some(p => p.productId === productId) ?? false

    return { favProducts, toggleFav, isFavourite }
}