import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"
import { getReturnHistory } from "@/actions/returns/getReturnHistory"

export function useGetReturnHistory() {
    return useQuery({
        queryKey: queryKeys.returnHistory,
        queryFn: () => getReturnHistory(),
    })
}