"use client"

import { Player } from "@lordicon/react"
import { useRef } from "react"
import deleteIcon from "./delete-icon.json"

export default function DeleteIcon({ hovered }: { hovered: boolean }) {
    const ref = useRef<Player>(null)

    return (
        <button className="cursor-pointer" onMouseEnter={() => ref.current?.playFromBeginning()}>
            <Player
                ref={ref}
                icon={deleteIcon}
                colorize={hovered ? "white" : ""}
                size={20}
            />
        </button>
    )
}