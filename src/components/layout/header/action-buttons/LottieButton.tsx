import {useRef} from "react";
import {Player} from "@lordicon/react";

export default function LottieButton({json, onClick}: { json: object; onClick?: () => void }) {
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