import {useQuery} from "@tanstack/react-query";
import productsRecommendations from "@/components/product/productsRecommendations";
import {ProductWithDetails} from "@/types/product-details";
import {CartItemWithDetails} from "@/types/cart";


interface UseGetProductsRecommendationsProps {
    gender: string;
    products?: ProductWithDetails[] | CartItemWithDetails[];
}
export function useGetProductsRecommendations({ gender, products }: UseGetProductsRecommendationsProps){
    return useQuery({
        queryKey: ["product"],
        queryFn: () => productsRecommendations({ gender, products})
    })
}