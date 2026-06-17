// hooks/useSearch.ts
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {searchCatalog} from "@/actions/search/search";
import {useDebouncedValue} from "@/hooks/search/useDebounceValue";
import {useGenderStore} from "@/store/useGenderStore";

export function useSearch(rawQuery: string) {
    const query = useDebouncedValue(rawQuery.trim(), 300)
    const gender = useGenderStore(s => s.gender);

    return useQuery({
        queryKey: ['search', query],
        queryFn: () => searchCatalog(query, gender),
        enabled: query.length >= 2,
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    })
}