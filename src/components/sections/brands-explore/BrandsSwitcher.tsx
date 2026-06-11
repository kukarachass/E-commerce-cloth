import {useState} from "react";
import Slider from "@/components/Slider/Slider";
import cn from "classnames";
import Image from "next/image";
import BrandCard from "@/components/ui/cards/BrandCard";


export default function BrandsSwitcher() {
    // const [selected, setSelected] = useState<Slug>("m-p");
    // const activeItems = brands.find((b) => b.slug === selected)?.items ?? [];

    return (
        <div className="flex flex-col gap-6">
            {/*<div className="flex flex-row gap-2">*/}
            {/*    {brands.map(b => (*/}
            {/*        <div key={b.id}>*/}
            {/*            <button*/}
            {/*                className={cn("cursor-pointer text-[16px] font-[600] rounded-full border py-2 px-4 transition-all duration-200", {*/}
            {/*                    ["bg-black text-white"]: selected === b.slug,*/}
            {/*                })}*/}
            {/*                onClick={() => setSelected(b.slug)}*/}
            {/*            >*/}
            {/*                {b.name}*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {/*<Slider>*/}
            {/*    {activeItems.map(i => (*/}
            {/*        <BrandCard brand={i}/>*/}
            {/*    ))}*/}
            {/*</Slider>*/}
            <span className="text-red-500 font-bold text-[18px]">ДОДЕЛАТЬ BRAND SWITCHER /compontents/sections.brand=explore/switcher</span>
        </div>
    )
}