"use client"

import { Player } from "@lordicon/react"
import { useRef } from "react"
import favIcon from "./fav.json"
import favSelectIcon from "./fav-select.json"

interface Props {
    selected?: boolean
    onChange?: () => void
}

export default function FavAnimIcon({ selected = false, onChange }: Props) {
    const favRef = useRef<Player>(null)
    const favSelectRef = useRef<Player>(null)

    const handleClick = () => {
        if (selected) {
            favRef.current?.playFromBeginning()
        } else {
            favSelectRef.current?.playFromBeginning()
            setTimeout(() => {
                favSelectRef.current?.pause()
            }, 500)
        }
        onChange?.()
    }

    return (
        <button onClick={handleClick}>
            <div className={selected ? "block" : "hidden"}>
                <Player ref={favSelectRef} icon={favSelectIcon} size={24} />
            </div>
            <div className={selected ? "hidden" : "block"}>
                <Player ref={favRef} icon={favIcon} size={24} />
            </div>
        </button>
    )
}