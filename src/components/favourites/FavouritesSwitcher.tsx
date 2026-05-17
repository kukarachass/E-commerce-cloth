"use client"

import cn from "classnames"
import { motion } from "framer-motion"

interface Props {
    onChange: (value: "brands" | "products") => void;
    current: "brands" | "products"
}

export default function FavouritesSwitcher({ onChange, current }: Props) {
    return (
        <div className="flex flex-row items-center bg-[#F9F9F9] max-w-[200px] py-2 rounded">
            <button
                className={cn("relative text-[16px] text-[#999] px-6 transition-colors duration-200", {
                    ["font-bold text-[var(--text)]"]: current === "products"
                })}
                onClick={() => onChange("products")}
            >
                Products
            </button>

            <div className="border-[0.5px] border-gray-300 self-stretch"/>

            <button
                className={cn("relative text-[16px] text-[#999] px-6 transition-colors duration-200", {
                    ["font-bold text-[var(--text)]"]: current === "brands"
                })}
                onClick={() => onChange("brands")}
            >
                Brands
            </button>
        </div>
    )
}