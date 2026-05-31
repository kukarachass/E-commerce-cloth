"use client"

import { motion } from "framer-motion";

interface FavIconProps {
    onChange?: () => void;
    className?: string;
    isFav: boolean;
    color?: "default" | "white";
}

export default function FavIcon({
                                    onChange,
                                    className,
                                    isFav,
                                    color = "default",
                                }: FavIconProps) {

    const isWhite = color === "white";

    const activeColor = isWhite ? "#ffffff" : "#000000";
    const borderColor = isWhite ? "#ffffff" : "#000000";

    const hoverColor = isWhite
        ? "rgba(255,255,255,0.18)"
        : "rgba(0,0,0,0.12)";

    return (
        <div onClick={() => onChange?.()}>
            <motion.button
                type="button"
                whileTap={{ scale: 0.72 }}
                className={className}
                transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 18,
                }}
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
                    {/* Белый контур — самый нижний слой */}
                    <path
                        d="M12 21C12 21 3 15.5 3 9.5C3 7.01 5.01 5 7.5 5C9.24 5 10.91 6.01 12 7.5C13.09 6.01 14.76 5 16.5 5C18.99 5 21 7.01 21 9.5C21 15.5 12 21 12 21Z"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        pointerEvents="none"
                    />

                    {/* Заливка */}
                    <motion.path
                        d="M12 21C12 21 3 15.5 3 9.5C3 7.01 5.01 5 7.5 5C9.24 5 10.91 6.01 12 7.5C13.09 6.01 14.76 5 16.5 5C18.99 5 21 7.01 21 9.5C21 15.5 12 21 12 21Z"
                        variants={{
                            rest: {
                                fill: isFav ? activeColor : "rgba(0,0,0,0)",
                                scale: 1,
                            },
                            hover: {
                                fill: isFav ? activeColor : hoverColor,
                                scale: 1.08,
                            },
                        }}
                        transition={{
                            fill: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
                            scale: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
                        }}
                        style={{ transformOrigin: "center", transformBox: "fill-box" }}
                    />

                    {/* Основной контур */}
                    <path
                        d="M12 21C12 21 3 15.5 3 9.5C3 7.01 5.01 5 7.5 5C9.24 5 10.91 6.01 12 7.5C13.09 6.01 14.76 5 16.5 5C18.99 5 21 7.01 21 9.5C21 15.5 12 21 12 21Z"
                        stroke={borderColor}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        pointerEvents="none"
                    />
                </motion.svg>
            </motion.button>
        </div>

    );
}