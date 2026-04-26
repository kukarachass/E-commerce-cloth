// hooks/useIsSticky.ts
import { useEffect, useRef, useState } from 'react'

export function useIsSticky() {
    const [isSticky, setIsSticky] = useState(false)
    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const node = sentinelRef.current
        if (!node) return
        const observer = new IntersectionObserver(
            ([entry]) => setIsSticky(!entry.isIntersecting),
            { threshold: 0, rootMargin: '0px' }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    return { isSticky, sentinelRef }
}