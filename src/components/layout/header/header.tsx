"use client"

import { useEffect, useRef, useState } from "react"
import TopBar from "@/components/layout/header/TopBar"
import MiddleBar from "@/components/layout/header/MiddleBar"
import BottomBar from "@/components/layout/header/BottomBar/BottomBar"
import {useStickyStore} from "@/store/useStickyStore";

export default function Header() {
    const setIsSticky = useStickyStore(state => state.setIsSticky)

    const topBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            const height = topBarRef.current?.offsetHeight ?? 0
            setIsSticky(window.scrollY > height)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <div ref={topBarRef}>
                <TopBar />
            </div>
            <MiddleBar/>
            <BottomBar/>
        </>
    )
}