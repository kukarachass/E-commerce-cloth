"use client"

import { useState, useRef, useCallback } from "react"
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton"
import { useFiltersStore } from "@/store/useFiltersStore"

const MIN = 0
const MAX = 1000

export default function PriceContent() {
    const setPrice = useFiltersStore(s => s.setPrice)
    const [minVal, setMinVal] = useState(5)
    const [maxVal, setMaxVal] = useState(291)
    const rangeRef = useRef<HTMLDivElement>(null)

    const getPercent = (value: number) => ((value - MIN) / (MAX - MIN)) * 100

    const handleMouseUp = useCallback(() => {
        setPrice(minVal, maxVal)
    }, [minVal, maxVal, setPrice])

    return (
        <div className="flex flex-col w-[300px] gap-4 p-4 cursor-pointer">
            {/* инпуты */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1">
                    <span className="text-[13px] text-gray-400">£</span>
                    <input
                        value={minVal}
                        onChange={(e) => {
                            const val = Math.min(Number(e.target.value), maxVal - 1)
                            setMinVal(val)
                        }}
                        onBlur={handleMouseUp}
                        className="text-[14px] outline-none bg-transparent w-full"
                        type="number"
                    />
                </div>
                <span className="text-[13px] text-gray-400 shrink-0">till</span>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1">
                    <span className="text-[13px] text-gray-400">£</span>
                    <input
                        value={maxVal}
                        onChange={(e) => {
                            const val = Math.max(Number(e.target.value), minVal + 1)
                            setMaxVal(val)
                        }}
                        onBlur={handleMouseUp}
                        className="text-[14px] outline-none bg-transparent w-full"
                        type="number"
                    />
                </div>
            </div>

            {/* слайдер */}
            <div className="relative h-[4px] bg-gray-200 rounded-full" ref={rangeRef}>
                {/* активный трек */}
                <div
                    className="absolute h-full bg-black rounded-full"
                    style={{
                        left: `${getPercent(minVal)}%`,
                        right: `${100 - getPercent(maxVal)}%`,
                    }}
                />

                {/* min ползунок */}
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={minVal}
                    onChange={(e) => setMinVal(Math.min(Number(e.target.value), maxVal - 1))}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                    style={{ pointerEvents: minVal === MAX ? "none" : "auto" }}
                />

                {/* max ползунок */}
                <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={maxVal}
                    onChange={(e) => setMaxVal(Math.max(Number(e.target.value), minVal + 1))}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* min thumb */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full shadow-md pointer-events-none z-20"
                    style={{ left: `calc(${getPercent(minVal)}% - 8px)` }}
                />

                {/* max thumb */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full shadow-md pointer-events-none z-20"
                    style={{ left: `calc(${getPercent(maxVal)}% - 8px)` }}
                />
            </div>

            <ResetButton />
        </div>
    )
}