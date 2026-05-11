"use client"

import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton"
import { colours } from "@/mocks/catalogStore"
import { useFiltersStore } from "@/store/useFiltersStore"
import cn from "classnames"

export default function ColoursContent() {
    const toggleColour = useFiltersStore(s => s.toggleColour)
    const selectedColours = useFiltersStore(s => s.colours)

    return (
        <div className="flex flex-col w-[280px] cursor-pointer">
            <div className="grid grid-cols-2 p-2">
                {colours.map((colour) => {
                    const isSelected = selectedColours.includes(colour.name)
                    return (
                        <label
                            key={colour.name}
                            onClick={() => toggleColour(colour.name)}
                            className={cn(
                                "flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors",
                                {
                                    "bg-gray-100": isSelected,
                                    "hover:bg-gray-50": !isSelected,
                                }
                            )}
                        >
                            <div className="relative w-6 h-6 shrink-0">
                                <div
                                    className="w-full h-full rounded-md border border-gray-200"
                                    style={
                                        colour.name === "Multicolour"
                                            ? { background: colour.hex }
                                            : { backgroundColor: colour.hex }
                                    }
                                />
                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path
                                                d="M2 6L5 9L10 3"
                                                stroke={colour.name === "White" || colour.name === "Beige" ? "#000" : "#fff"}
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <span className={cn("text-[14px]", {
                                "font-medium text-black": isSelected,
                                "text-[var(--text)]": !isSelected,
                            })}>
                                {colour.name}
                            </span>
                        </label>
                    )
                })}
            </div>
            <ResetButton />
        </div>
    )
}