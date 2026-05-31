"use client"


import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getFavouriteBrands, toggleFavouriteBrand} from "@/actions/favourites/favourite-brand";
import {toast} from "sonner";

export default function useFavouriteBrands() {
    const queryClient = useQueryClient();

    const { data: favBrands = [] } = useQuery({
        queryKey: ["favourite-brands"],
        queryFn: () => getFavouriteBrands(),
    })

    const { mutate: toggleFav } = useMutation({
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

    const isFavourite = (brandId: string) =>
        favBrands?.some(b => b.id === brandId) ?? false

    return { favBrands, toggleFav, isFavourite }
}