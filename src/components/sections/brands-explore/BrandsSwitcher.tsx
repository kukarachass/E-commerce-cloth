"use client"

import {useState} from "react";
import Slider from "@/components/Slider/Slider";
import cn from "classnames";
import BrandCard from "@/components/ui/cards/BrandCard";
import {brandTypes, BrandWithType} from "@/types/homepage";

export default function BrandsSwitcher({ brands }: { brands: BrandWithType[] }) {
    const [selected, setSelected] = useState<brandTypes>("popular");
    const types = Array.from(new Set(brands.map(b => b.brandType)));
    const activeItems = brands.filter(b => b.brandType === selected);

    return (
        <div className="flex flex-col gap-7">
            <div className="flex flex-row gap-2">
                {types.map(type => (
                    <button
                        key={type}
                        onClick={() => setSelected(type)}
                        className={cn(
                            "cursor-pointer rounded-[10px] border px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.04em] transition-colors duration-200",
                            selected === type
                                ? "border-black bg-black text-white"
                                : "border-black/15 bg-transparent text-[var(--text)] hover:border-black/40"
                        )}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <Slider>
                {activeItems.map(brand => (
                    <BrandCard key={brand.brand.id} variant="default" brand={brand.brand}/>
                ))}
            </Slider>
        </div>
    )
}