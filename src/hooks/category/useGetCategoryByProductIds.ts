import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/lib/queryKeys";
import {getCategoriesByProductIds} from "@/actions/category/categories";

export function useGetCategoryByProductIds(productIds: string[]) {
    return useQuery({
        queryKey: [...queryKeys.categories, productIds],
        queryFn: () => getCategoriesByProductIds(productIds),
        enabled: productIds.length > 0,
    })
}