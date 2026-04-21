"use client"

import { Player } from "@lordicon/react"
import { useRef } from "react"
import cartIcon from "./cartIcon.json"
import favoriteIcon from "./favoriteIcon.json"
import profileIcon from "./profileIcon.json"
import {useRouter} from "next/navigation";


export default function HeaderActions(){
    const cartRef = useRef<Player>(null)
    const favoriteRef = useRef<Player>(null)
    const profileRef = useRef<Player>(null)

    const router = useRouter();

    return(
        <div className="flex gap-4 items-center">
            <button onClick={() => router.push("/cart")} className="cursor-pointer" onMouseEnter={() => cartRef.current?.playFromBeginning()}>
                <Player
                    ref={cartRef}
                    icon={cartIcon}
                    size={24}
                />
            </button>
            <button onClick={() => router.push("/favorite")} className="cursor-pointer" onMouseEnter={() => favoriteRef.current?.playFromBeginning()}>
                <Player
                    ref={favoriteRef}
                    icon={favoriteIcon}
                    size={24}
                />
            </button>
            <button onClick={() => router.push("/profile")} className="hidden lg:block cursor-pointer" onMouseEnter={() => profileRef.current?.playFromBeginning()}>
                <Player
                    ref={profileRef}
                    icon={profileIcon}
                    size={24}
                />
            </button>
        </div>
    )
}