// hooks/useCollections.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { getCollections } from "@/actions/collection/collection"
import {useGender} from "@/hooks/useGender";

export function useCollections() {
    const gender = useGender();

    return useQuery({
        queryKey: ["collections", gender],
        queryFn: () => getCollections(gender),
    })
}