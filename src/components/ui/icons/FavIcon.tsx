"use client"

import { motion } from "framer-motion";

interface FavIconProps {
    onChange?: () => void;
    className?: string;
    isFav: boolean;
    color?: "default" | "white";
}

const HEART_PATH = "M12 21C12 21 3 15.5 3 9.5C3 7.01 5.01 5 7.5 5C9.24 5 10.91 6.01 12 7.5C13.09 6.01 14.76 5 16.5 5C18.99 5 21 7.01 21 9.5C21 15.5 12 21 12 21Z";

export default function FavIcon({
                                    onChange,
                                    className,
                                    isFav,
                                    color = "default",
                                }: FavIconProps) {
    const isWhite = color === "white";

    const activeColor = isWhite ? "#ffffff" : "#111111";
    const restFill  = isWhite ? "rgba(255,255,255,0.35)" : "rgba(17,17,17,0.35)";
    const hoverFill = isWhite ? "rgba(255,255,255,0.55)" : "rgba(17,17,17,0.55)";

    return (
        <motion.button
            onClick={() => onChange?.()}
            type="button"
            whileTap={{ scale: 0.72 }}
            transition={{ type: "spring", stiffness: 450, damping: 18 }}
            className={className}
            style={{
                padding: 0,
                margin: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial="rest"
                animate="rest"
                whileHover="hover"
                style={{ overflow: "visible", display: "block" }}
            >
                {/* Белая подложка — та же форма, чуть крупнее, лежит снизу. Это и есть бордер */}
                <path
                    d={HEART_PATH}
                    fill="white"
                    style={{ transformOrigin: "center", transformBox: "fill-box", transform: "scale(1.18)" }}
                    pointerEvents="none"
                />

                {/* Само сердце поверх — без обводки */}
                <motion.path
                    d={HEART_PATH}
                    variants={{
                        rest:  { fill: isFav ? activeColor : restFill,  scale: 1 },
                        hover: { fill: isFav ? activeColor : hoverFill, scale: 1.08 },
                    }}
                    transition={{
                        fill:  { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
                        scale: { type: "spring", stiffness: 450, damping: 18 },
                    }}
                    style={{ transformOrigin: "center", transformBox: "fill-box" }}
                />
            </motion.svg>
        </motion.button>
    );
}