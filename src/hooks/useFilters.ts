// hooks/useFilters.ts
"use client"

import {useRouter, useSearchParams, usePathname} from "next/navigation"
import {useCallback} from "react"

export function useFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const removeFilters = useCallback((key: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString())
        const current = params.getAll(key).filter(v => !values.includes(v))
        params.delete(key)
        current.forEach(v => params.append(key, v))
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [router, pathname, searchParams])

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

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [router, pathname, searchParams])

    const setUniqueFilter = useCallback(
        (filters: Record<string, string>) => {
            const params = new URLSearchParams(searchParams.toString())
            Object.entries(filters).forEach(([key, value]) => {
                params.set(key, value)
            })
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
        },
        [router, pathname, searchParams]
    )

    const clearFilter = useCallback(

        (keys: string | string[]) => {
            const params = new URLSearchParams(searchParams.toString())
            if (Array.isArray(keys)) {
                keys.forEach((key) => params.delete(key))
            } else {
                params.delete(keys)
            }

            const query = params.toString()
            router.push(
                query ? `${pathname}?${query}` : pathname,
                { scroll: false }
            )
        },
        [router, pathname, searchParams]
    )

    const clearAll = useCallback(() => {
        router.push(pathname)
    }, [router, pathname])

    const isSelected = useCallback((key: string, value: string) => {
        return searchParams.getAll(key).includes(value)
    }, [searchParams])

    return {setFilter, clearFilter, clearAll, isSelected, setUniqueFilter, searchParams, removeFilters}
}