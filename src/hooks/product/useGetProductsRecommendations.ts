import {useQuery} from "@tanstack/react-query";
import productsRecommendations from "@/components/product/productsRecommendations";
import {CartItemWithDetails} from "@/types/cart";


interface UseGetProductsRecommendationsProps {
    gender: string;
    cartItems?: CartItemWithDetails[];
}
export function useGetProductsRecommendations({ gender, cartItems }: UseGetProductsRecommendationsProps){
    return useQuery({
        queryKey: ["product"],
        queryFn: () => productsRecommendations({ gender, cartItems})
    })
}