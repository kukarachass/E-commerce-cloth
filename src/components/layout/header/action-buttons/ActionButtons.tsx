"use client"

import { useRouter } from "next/navigation"
import { useStickyStore } from "@/store/useStickyStore"
import { useSearchStore } from "@/store/useSearchOpen"
import { Player } from "@lordicon/react"
import { useRef } from "react"

import searchJson from "./search.json"
import accountJson from "./account.json"
import favJson from "./fav.json"
import cartJson from "./cart.json"

function LottieButton({ json, onClick }: { json: object; onClick?: () => void }) {
    const ref = useRef<Player>(null)

    return (
        <button
            className="cursor-pointer"
            onClick={onClick}
            onMouseEnter={() => ref.current?.playFromBeginning()}
        >
            <Player
                ref={ref}
                icon={json}
                size={24}
                onComplete={() => ref.current?.pause()}
            />
        </button>
    )
}

export default function ActionButtons() {
    const isSticky = useStickyStore(state => state.isSticky)
    const setSearchOpen = useSearchStore(state => state.setSearchOpen)
    const searchOpen = useSearchStore(state => state.searchOpen)
    const router = useRouter()

    return (
        <div className="flex flex-row items-center gap-4">
            {isSticky && (
                <LottieButton
                    json={searchJson}
                    onClick={() => setSearchOpen(!searchOpen)}
                />
            )}
            <LottieButton json={accountJson} onClick={() => router.push("/profile")} />
            <LottieButton json={favJson} onClick={() => router.push("/fav")} />
            <LottieButton json={cartJson} onClick={() => router.push("/cart")} />
        </div>
    )
}