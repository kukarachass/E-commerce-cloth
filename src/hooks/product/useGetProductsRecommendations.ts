import {useQuery} from "@tanstack/react-query";
import {CartItemWithDetails} from "@/types/cart";
import productsRecommendations from "@/actions/products/productsRecommendations";
import {queryKeys} from "@/lib/queryKeys";
import {Gender} from "@/hooks/useGender";


interface UseGetProductsRecommendationsProps {
    gender: Gender;
    cartItems?: CartItemWithDetails[];
}
export function useGetProductsRecommendations({ gender, cartItems }: UseGetProductsRecommendationsProps){
    const productIds = cartItems?.map(i => i.productId).sort().join(",") ?? ""

    return useQuery({
        queryKey: queryKeys.recommendations(gender, productIds),
        queryFn: () => productsRecommendations({ gender, cartItems}),
        enabled: !!gender && cartItems !== undefined, // ждём именно ЗАГРУЗКИ корзины, а не непустого списка

    })
}