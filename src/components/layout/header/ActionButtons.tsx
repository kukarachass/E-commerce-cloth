"use client"

import {useRouter} from "next/navigation";
import ProfileIconSvg from "@/components/ui/icons/ProfileIconSvg";
import FavoritesIconSvg from "@/components/ui/icons/FavoritesIconSvg";
import CartIconSvg from "@/components/ui/icons/CartIconSvg";
import {useStickyStore} from "@/store/useStickyStore";
import SearchIconSvg from "@/components/ui/icons/SearchIconSvg";
import {useState} from "react";
import {useSearchStore} from "@/store/useSearchOpen";

export default function ActionButtons(){
    const isSticky = useStickyStore(state => state.isSticky)
    const setSearchOpen = useSearchStore(state => state.setSearchOpen);
    const searchOpen = useSearchStore(state => state.searchOpen);

    const router = useRouter()
    return(
        <div className="flex flex-row items-center gap-4">
            {isSticky && (
                <button onClick={() => setSearchOpen(!searchOpen)}>
                    <SearchIconSvg/>
                </button>
            )}

            <button onClick={() => router.push("/profile")}>
                <ProfileIconSvg/>
            </button>
            <button onClick={() => router.push("/fav")}>
                <FavoritesIconSvg/>
            </button>
            <button onClick={() => router.push("/cart")}>
                <CartIconSvg/>
            </button>
        </div>
    )
}