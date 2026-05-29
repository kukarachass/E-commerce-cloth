"use client"

import {useState, useCallback, useEffect} from "react"
import ResetButton from "@/components/catalog/filters/filters-modal-content/ResetButton"
import { Price } from "@/types/filters/price"
import { useFilters } from "@/hooks/useFilters"
import {useSearchParams} from "next/navigation";

interface PriceContentProps {
    price: Price[]
}

const GAP = 1

export default function PriceContent({ price }: PriceContentProps) {
    const searchParams = useSearchParams()
    const lo = Number(price[0]?.minPrice ?? 0)
    const hi = Number(price[0]?.maxPrice ?? 1000)

    const [minVal, setMinVal] = useState(lo)
    const [maxVal, setMaxVal] = useState(hi)

    useEffect(() => {
        const min = Number(searchParams.get("minPrice") ?? lo)
        const max = Number(searchParams.get("maxPrice") ?? hi)

        setMinVal(min)
        setMaxVal(max)
    }, [searchParams, lo, hi])

    const { setUniqueFilter } = useFilters()

    const clamp = (v: number, min: number, max: number) =>
        Math.min(Math.max(v, min), max)

    // защита от деления на ноль + ограничение 0..100 для отрисовки
    const getPercent = useCallback(
        (value: number) =>
            hi === lo ? 0 : clamp(((value - lo) / (hi - lo)) * 100, 0, 100),
        [lo, hi]
    )

    const commit = useCallback(
        (newMin: number, newMax: number) => {
            setUniqueFilter({
                minPrice: String(newMin),
                maxPrice: String(newMax),
            })
        },
        [setUniqueFilter]
    )

    const percentMin = getPercent(minVal)
    const percentMax = getPercent(maxVal)

    return (
        <div className="flex flex-col w-[300px] gap-5 p-4">
            {/* инпуты */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1">
                    <span className="text-[13px] text-gray-400">€</span>
                    <input
                        value={minVal}
                        type="number"
                        min={lo}
                        max={maxVal - GAP}
                        onChange={(e) => setMinVal(Number(e.target.value))}
                        onBlur={() => {
                            const v = clamp(minVal || lo, lo, maxVal - GAP)
                            setMinVal(v)
                            commit(v, maxVal)
                        }}
                        className="text-[14px] outline-none bg-transparent w-full"
                    />
                </div>

                <span className="text-[13px] text-gray-400 shrink-0">till</span>

                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 flex-1">
                    <span className="text-[13px] text-gray-400">€</span>
                    <input
                        value={maxVal}
                        type="number"
                        min={minVal + GAP}
                        max={hi}
                        onChange={(e) => setMaxVal(Number(e.target.value))}
                        onBlur={() => {
                            const v = clamp(maxVal || hi, minVal + GAP, hi)
                            setMaxVal(v)
                            commit(minVal, v)
                        }}
                        className="text-[14px] outline-none bg-transparent w-full"
                    />
                </div>
            </div>

            {/* слайдер */}
            <div className="relative h-[4px] bg-gray-200 rounded-full">
                {/* активный трек */}
                <div
                    className="absolute h-full bg-black rounded-full"
                    style={{
                        left: `${percentMin}%`,
                        right: `${100 - percentMax}%`,
                    }}
                />

                {/* min ползунок */}
                <input
                    type="range"
                    min={lo}
                    max={hi}
                    value={minVal}
                    onChange={(e) => {
                        const v = Math.min(Number(e.target.value), maxVal - GAP)
                        setMinVal(v)
                    }}
                    onMouseUp={() => commit(minVal, maxVal)}
                    onTouchEnd={() => commit(minVal, maxVal)}
                    className="price-range-input"
                    // поднимаем min над max, когда он в правой половине,
                    // иначе его бегунок не вытащить из-под max
                    style={{ zIndex: minVal > (lo + hi) / 2 ? 5 : 3 }}
                />

                {/* max ползунок */}
                <input
                    type="range"
                    min={lo}
                    max={hi}
                    value={maxVal}
                    onChange={(e) => {
                        const v = Math.max(Number(e.target.value), minVal + GAP)
                        setMaxVal(v)
                    }}
                    onMouseUp={() => commit(minVal, maxVal)}
                    onTouchEnd={() => commit(minVal, maxVal)}
                    className="price-range-input"
                    style={{ zIndex: 4 }}
                />
            </div>

            <ResetButton />

            <style>{`
                .price-range-input {
                    -webkit-appearance: none;
                    appearance: none;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 100%;
                    height: 16px;
                    margin: 0;
                    background: transparent;
                    pointer-events: none; /* трек кликами не управляется */
                    outline: none;
                }
                .price-range-input::-webkit-slider-runnable-track {
                    background: transparent;
                    border: none;
                    height: 16px;
                }
                .price-range-input::-moz-range-track {
                    background: transparent;
                    border: none;
                    height: 16px;
                }
                .price-range-input::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    pointer-events: auto; /* перетаскивается только бегунок */
                    height: 16px;
                    width: 16px;
                    border-radius: 9999px;
                    background: #000;
                    border: 2px solid #fff;
                    box-shadow: 0 1px 4px rgba(0,0,0,.35);
                    cursor: pointer;
                }
                .price-range-input::-moz-range-thumb {
                    pointer-events: auto;
                    height: 16px;
                    width: 16px;
                    border-radius: 9999px;
                    background: #000;
                    border: 2px solid #fff;
                    box-shadow: 0 1px 4px rgba(0,0,0,.35);
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
}