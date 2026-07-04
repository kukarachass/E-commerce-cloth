import { useState, useRef } from "react"

const CLOSE_THRESHOLD = 80
const VELOCITY_THRESHOLD = 0.5

export function useSwipeToClose(onClose: () => void) {
    const [dragY, setDragY] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const startY = useRef(0)
    const startTime = useRef(0)
    const dragYRef = useRef(0)

    const onTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY
        startTime.current = Date.now()
        setIsDragging(true)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        const y = Math.max(0, e.touches[0].clientY - startY.current)
        dragYRef.current = y
        setDragY(y)
    }

    const onTouchEnd = () => {
        setIsDragging(false)
        const elapsed = Date.now() - startTime.current
        const velocity = elapsed > 0 ? dragYRef.current / elapsed : 0
        const shouldClose = dragYRef.current > CLOSE_THRESHOLD || velocity > VELOCITY_THRESHOLD

        if (shouldClose) {
            setDragY(window.innerHeight)
            setTimeout(() => { onClose(); setDragY(0); dragYRef.current = 0 }, 220)
        } else {
            setDragY(0)
            dragYRef.current = 0
        }
    }

    return { dragY, isDragging, dragHandlers: { onTouchStart, onTouchMove, onTouchEnd } }
}