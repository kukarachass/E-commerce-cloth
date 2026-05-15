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
                    style={{
                        overflow: "visible",
                        display: "block",
                    }}
                >
                    <motion.path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.50164 4C6.26946 4 5.15388 4.50197 4.33945 5.31916C3.5317 6.12964 3.01667 7.25048 3 8.58204C3.00297 12.0163 5.60396 15.9967 12.39 20C18.4603 15.8379 20.9948 11.9841 21 8.33845C20.9392 7.13018 20.4182 6.04641 19.6095 5.263C18.8004 4.47906 17.7081 4 16.5043 4C15.3005 4 14.2083 4.47906 13.3991 5.263C13.1857 5.46972 12.9922 5.69764 12.8216 5.94344L12.003 7.12299L11.1844 5.94343C11.0139 5.69779 10.8203 5.46981 10.6069 5.263C9.79768 4.47906 8.70542 4 7.50164 4Z"
                        variants={{
                            rest: {
                                fill: isFav ? activeColor : "rgba(0,0,0,0)",
                                scale: 1,
                            },
                            hover: {
                                fill: isFav ? activeColor : hoverColor,
                                scale: 1.04,
                            },
                        }}
                        transition={{
                            fill: {
                                duration: 0.22,
                                ease: [0.4, 0, 0.2, 1],
                            },
                            scale: {
                                duration: 0.22,
                                ease: [0.4, 0, 0.2, 1],
                            },
                        }}
                        style={{
                            transformOrigin: "center",
                            transformBox: "fill-box",
                        }}
                    />

                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7.50164 4C6.26947 4 5.15388 4.49646 4.33945 5.30467C3.5317 6.10625 3.01667 7.21479 3 8.53173C3.00297 11.9283 5.60396 15.865 12.39 19.8243C18.4603 15.7079 20.9948 11.8965 21 8.29081C20.9392 7.09581 20.4182 6.02394 19.6095 5.24913C18.8004 4.4738 17.7081 4 16.5043 4C15.3005 4 14.2083 4.4738 13.3991 5.24913C13.1857 5.45359 12.9922 5.67899 12.8216 5.9221L12.003 7.08869L11.1844 5.92209C11.0139 5.67914 10.8203 5.45367 10.6069 5.24913C9.79768 4.4738 8.70542 4 7.50164 4V4M2.93067 3.88505C4.10352 2.72115 5.7193 2 7.50164 2C9.24264 2 10.8249 2.68817 11.9905 3.80504C11.9947 3.80901 11.9988 3.81299 12.003 3.81698C12.0071 3.81299 12.0113 3.80901 12.0154 3.80504C13.181 2.68817 14.7633 2 16.5043 2C18.2453 2 19.8276 2.68817 20.9932 3.80504C22.1642 4.92698 22.9189 6.48589 22.9989 8.22047L23 8.24274V8.26504C23.007 12.9096 19.7472 17.252 13.5111 21.4806C13.333 21.6014 13.155 21.7203 12.9774 21.8366L12.4681 22.1701L11.938 21.8708C11.7544 21.7672 11.5697 21.6612 11.3838 21.5528C4.41417 17.4867 1 13.0259 1 8.5259V8.51435H1.00007C1.02148 6.66048 1.75574 5.051 2.93067 3.88505Z"
                        fill={borderColor}
                        fillOpacity="0.9"
                        pointerEvents="none"
                    />
                </motion.svg>
            </motion.button>
        </div>

    );
}