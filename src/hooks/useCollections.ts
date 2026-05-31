// hooks/useCollections.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { getCollections } from "@/actions/collection/collection"
import { useGenderStore } from "@/store/useGenderStore"

export function useCollections() {
    const gender = useGenderStore(s => s.gender)

    return useQuery({
        queryKey: ["collections", gender],
        queryFn: () => getCollections(gender),
    })
}