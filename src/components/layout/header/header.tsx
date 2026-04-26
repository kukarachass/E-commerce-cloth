"use client"

import { useEffect, useRef, useState } from "react"
import TopBar from "@/components/layout/header/TopBar"
import MiddleBar from "@/components/layout/header/MiddleBar"
import BottomBar from "@/components/layout/header/BottomBar/BottomBar"
import {useStickyStore} from "@/store/useStickyStore";
import {useSearchStore} from "@/store/useSearchOpen";

export default function Header() {
    const setIsSticky = useStickyStore(state => state.setIsSticky)
    const searchOpen = useSearchStore(state => state.searchOpen);
    const setSearchOpen = useSearchStore(state => state.setSearchOpen);


    const topBarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            const height = topBarRef.current?.offsetHeight ?? 0
            setIsSticky(window.scrollY > height)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if(searchOpen){
            document.body.style.overflow = 'hidden';
            console.log("hidden");
        } else {
            document.body.style.overflow = 'unset';
            console.log("unset");

        }

        console.log("search opene value: ", searchOpen)
    }, [searchOpen]);


    return (
        <>
            {searchOpen && (
                <div onClick={() => setSearchOpen(!searchOpen)} className="fixed inset-0 bg-black/40 z-40 pointer-events-auto" />
            )}
            <div ref={topBarRef}>
                <TopBar />
            </div>
            <MiddleBar/>
            <BottomBar/>
        </>
    )
}