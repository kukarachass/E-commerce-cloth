// hooks/user/useUser.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/actions/user/get-user"

export function useGetUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: () => getUser(),
    })
}