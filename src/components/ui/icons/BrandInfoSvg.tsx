"use client"

import { motion } from "framer-motion";

export default function BrandInfoSvg() {
    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="inline-flex items-center justify-center cursor-pointer"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    overflow: "visible",
                }}
            >
                <g clipPath="url(#clip0_312_4383)">
                    <motion.path
                        d="M2.5 4C2.5 2.89543 3.39543 2 4.5 2H12.2574C12.7878 2 13.2965 2.21071 13.6716 2.58579L22.6716 11.5858C23.4526 12.3668 23.4526 13.6332 22.6716 14.4142L14.9142 22.1716C14.1332 22.9526 12.8668 22.9526 12.0858 22.1716L3.08579 13.1716C2.71071 12.7965 2.5 12.2878 2.5 11.7574V4V4"
                        stroke="white"
                        strokeWidth="2"
                        variants={{
                            rest: {
                                fill: "rgba(255,255,255,0)",
                            },
                            hover: {
                                fill: "rgba(255,255,255,0.15)",
                            },
                        }}
                        transition={{
                            duration: 0.22,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                    />

                    <path
                        d="M5.5 6.5C5.5 7.32787 6.17213 8 7 8C7.82787 8 8.5 7.32787 8.5 6.5C8.5 5.67213 7.82787 5 7 5C6.17213 5 5.5 5.67213 5.5 6.5V6.5"
                        fill="white"
                    />
                </g>

                <defs>
                    <clipPath id="clip0_312_4383">
                        <rect width="24" height="24" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </motion.div>
    )
}