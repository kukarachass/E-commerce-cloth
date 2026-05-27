// hooks/useFilters.ts
"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

export function useFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const setFilter = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        const current = params.getAll(key)

        if (current.includes(value)) {
            // Убираем если уже выбран
            const updated = current.filter(v => v !== value)
            params.delete(key)
            updated.forEach(v => params.append(key, v))
        } else {
            // Добавляем если не выбран
            params.append(key, value)
        }

        router.push(`${pathname}?${params.toString()}`)
    }, [router, pathname, searchParams])

    const clearFilter = useCallback((key: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key)
        router.push(`${pathname}?${params.toString()}`)
    }, [router, pathname, searchParams])

    const clearAll = useCallback(() => {
        router.push(pathname)
    }, [router, pathname])

    const isSelected = useCallback((key: string, value: string) => {
        return searchParams.getAll(key).includes(value)
    }, [searchParams])

    return { setFilter, clearFilter, clearAll, isSelected, searchParams }
}