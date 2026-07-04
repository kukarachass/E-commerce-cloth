import {useQuery} from "@tanstack/react-query";
import {CartItemWithDetails} from "@/types/cart";
import productsRecommendations from "@/actions/products/productsRecommendations";


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