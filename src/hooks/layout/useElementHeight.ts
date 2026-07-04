// hooks/layout/useElementHeight.ts
import { useEffect, useRef } from "react"

export function useElementHeight<T extends HTMLElement>(
    onHeightChange: (height: number) => void
) {
    const ref = useRef<T>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const update = () => onHeightChange(el.offsetHeight)
        update()

        const observer = new ResizeObserver(update)
        observer.observe(el)

        return () => observer.disconnect()
    }, [onHeightChange])

    return ref
}