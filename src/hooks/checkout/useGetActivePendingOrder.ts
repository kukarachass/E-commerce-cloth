import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/lib/queryKeys";
import {getActivePendingOrder} from "@/actions/checkout/getActivePendingOrder";

export default function useGetActivePendingOrder(){
    return useQuery({
        queryKey: queryKeys.activePendingOrder,
        queryFn: () => getActivePendingOrder(),
    })
}