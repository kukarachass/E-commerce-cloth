"use client"

import { useQuery } from "@tanstack/react-query"
import {queryKeys} from "@/lib/queryKeys";
import {getProduct} from "@/actions/products/get-product";

export function useProduct(slug: string) {
    return useQuery({
        queryKey: queryKeys.product(slug),
        queryFn: () => getProduct({ slug }),
    })
}