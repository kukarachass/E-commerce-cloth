import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { getReturnableOrders } from "@/actions/returns/getReturnableOrders"

export function useGetReturnableOrders() {
    return useQuery({
        queryKey: queryKeys.returnableOrders, // отдельный ключ! не пересекай с orders
        queryFn: () => getReturnableOrders(),
    })
}