import { useSearchParams } from "next/navigation"
import { FILTER_KEYS_MAP } from "@/components/catalog/filters/filterKeysMap"

export function useActiveFilterCount() {
    const searchParams = useSearchParams()
    return Object.values(FILTER_KEYS_MAP)
        .flat()
        .reduce((acc, key) => acc + searchParams.getAll(key).length, 0)
}