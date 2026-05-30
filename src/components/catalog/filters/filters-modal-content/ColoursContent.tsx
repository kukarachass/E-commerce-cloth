"use client"

import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton"
import { useFiltersStore } from "@/store/useFiltersStore"
import cn from "classnames"
import {Color} from "@/types/filters/color";
import {useFilters} from "@/hooks/useFilters";

interface ColoursContentProps {
    colors: Color[];
}

export default function ColoursContent({ colors }: ColoursContentProps) {
    const { setFilter, isSelected } = useFilters()


    return (
        <div className="flex flex-col w-[280px] cursor-pointer">
            <div className="grid grid-cols-2 p-2">
                {colors.map((color) => {
                    return (
                        <label
                            key={color.name}
                            onClick={() => setFilter("color", color.name)}
                            className={cn(
                                "flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors",
                                {
                                    "bg-gray-100": isSelected("color", color.name),
                                    "hover:bg-gray-50": !isSelected("color", color.name),
                                }
                            )}
                        >
                            <div className="relative w-6 h-6 shrink-0">
                                <div
                                    className="w-full h-full rounded-md border border-gray-200"
                                    style={
                                        color.name === "Multicolour"
                                            ? { background: color.hex }
                                            : { backgroundColor: color.hex }
                                    }
                                />
                                {isSelected("color", color.name) && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path
                                                d="M2 6L5 9L10 3"
                                                stroke={color.name === "White" || color.name === "Beige" ? "#000" : "#fff"}
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <span className={cn("text-[14px]", {
                                "font-medium text-black": isSelected("color", color.name),
                                "text-[var(--text)]": !isSelected("color", color.name),
                            })}>
                                {color.name}
                            </span>
                        </label>
                    )
                })}
            </div>
            <ResetButton keyName="color" />
        </div>
    )
}