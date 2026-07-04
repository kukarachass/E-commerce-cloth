"use client"

import { useEffect, useRef } from "react"
import TopBar from "@/components/layout/header/TopBar"
import MiddleBar from "@/components/layout/header/MiddleBar"
import BottomBar from "@/components/layout/header/BottomBar/BottomBar"
import { useStickyStore } from "@/store/useStickyStore"
import { useSearchStore } from "@/store/useSearchOpen"
import {useMobileMenuStore} from "@/store/adaptive/useMobileMenuStore";

export default function Header() {
    const setIsSticky = useStickyStore(state => state.setIsSticky)
    const searchOpen = useSearchStore(state => state.searchOpen)
    const setSearchOpen = useSearchStore(state => state.setSearchOpen)
    const menuOpen = useMobileMenuStore(state => state.isOpen)

    const topBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            const height = topBarRef.current?.offsetHeight ?? 0
            setIsSticky(window.scrollY > height)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Централизованный scroll lock — один источник истины
    useEffect(() => {
        document.body.style.overflow = searchOpen || menuOpen ? "hidden" : ""
        return () => { document.body.style.overflow = "" }
    }, [searchOpen, menuOpen])

    return (
        <>
            {searchOpen && (
                <div
                    onClick={() => setSearchOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 pointer-events-auto"
                />
            )}
            <div ref={topBarRef}>
                <TopBar />
            </div>
            <MiddleBar />
            <BottomBar />
        </>
    )
}