import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/lib/queryKeys";
import {getOrders} from "@/actions/order/getOrders";

export function useGetOrders(){
    return useQuery({
        queryKey: queryKeys.orders,
        queryFn: () => getOrders(),
    })
}