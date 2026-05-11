"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

export function useFilters() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const setFilter = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        router.push(`${pathname}?${params.toString()}`)
    }, [searchParams, pathname, router])

    const toggleFilter = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const current = params.getAll(key)

        if (current.includes(value)) {
            // убираем значение
            params.delete(key)
            current.filter(v => v !== value).forEach(v => params.append(key, v))
        } else {
            params.append(key, value)
        }

        router.push(`${pathname}?${params.toString()}`)
    }, [searchParams, pathname, router])

    const clearFilter = useCallback((key: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key)
        router.push(`${pathname}?${params.toString()}`)
    }, [searchParams, pathname, router])

    const clearAll = useCallback(() => {
        router.push(pathname)
    }, [pathname, router])

    const getFilter = (key: string) => searchParams.getAll(key)
    const isActive = (key: string, value: string) => searchParams.getAll(key).includes(value)

    return { setFilter, toggleFilter, clearFilter, clearAll, getFilter, isActive }
}