import { useEffect, useState } from "react"

// До монтирования на клиенте компонент должен рендерить то же самое,
// что было на сервере — иначе React увидит расхождение атрибутов при гидратации.
// Используется для любого client-only состояния (localStorage, matchMedia, favourites и т.д.)
export function useHasMounted() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return mounted
}