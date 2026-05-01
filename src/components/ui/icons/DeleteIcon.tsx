"use client"

import { Player } from "@lordicon/react"
import { useRef } from "react"
import deleteIcon from "./delete-icon.json"

export default function DeleteIcon() {
    const ref = useRef<Player>(null)

    return (
        <button onMouseEnter={() => ref.current?.playFromBeginning()}>
            <Player
                ref={ref}
                icon={deleteIcon}
                size={20}
            />
        </button>
    )
}