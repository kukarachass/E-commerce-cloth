import {useState} from "react";
import Slider from "@/components/Slider/Slider";
import cn from "classnames";
import Image from "next/image";
import AddToFavBrandButton from "@/components/product/AddToFavBrandButton";
import BrandCard from "@/components/ui/cards/BrandCard";

const brands = [
    {
        id: "1",
        slug: "n-b",
        name: "New Brands",
        items: [
            {
                id: "1",
                imgUrl: "/brand-banners/levis-banner.avif",
                tags: [
                    { id: "t-1", name: "sale", color: "#d0021b" },
                    { id: "t-2", name: "new items", color: "#000" },
                ],
                discount: 60
            },
            {
                id: "2",
                imgUrl: "/brand-banners/all-saints-banner.jpg",
                tags: [
                    { id: "t-3", name: "sale", color: "#d0021b" },
                    { id: "t-4", name: "new items", color: "#000" },
                ],
                discount: 65
            },
            {
                id: "3",
                imgUrl: "/brand-banners/all-saints-banner.jpg",
                tags: [
                    { id: "t-5", name: "sale", color: "#d0021b" },
                    { id: "t-6", name: "new items", color: "#000" },
                ],
                discount: 70
            },
            {
                id: "4",
                imgUrl: "/brand-banners/levis-banner.avif",
                tags: [
                    { id: "t-7", name: "sale", color: "#d0021b" },
                    { id: "t-8", name: "new items", color: "#000" },
                ],
                discount: 20
            },
            {
                id: "5",
                imgUrl: "/brand-banners/levis-banner.avif",
                tags: [
                    { id: "t-7", name: "sale", color: "#d0021b" },
                    { id: "t-8", name: "new items", color: "#000" },
                ],
                discount: 20
            }
        ]
    },
    {
        id: "2",
        slug: "m-p",
        name: "Most popular",
        items: [
            {
                id: "5",
                imgUrl: "/brand-banners/m-kors-banner.jpg",
                tags: [
                    { id: "t-9",  name: "sale", color: "#d0021b" },
                    { id: "t-10", name: "new items", color: "#000" },
                ],
                discount: 60
            },
            {
                id: "6",
                imgUrl: "/brand-banners/all-saints-banner.jpg",
                tags: [
                    { id: "t-11", name: "sale", color: "#d0021b" },
                    { id: "t-12", name: "new items", color: "#000" },
                ],
                discount: 65
            },
            {
                id: "7",
                imgUrl: "/brand-banners/all-saints-banner.jpg",
                tags: [
                    { id: "t-13", name: "sale", color: "#d0021b" },
                    { id: "t-14", name: "new items", color: "#000" },
                ],
                discount: 70
            },
            {
                id: "8",
                imgUrl: "/brand-banners/rickowens-banner.jpg",
                tags: [
                    { id: "t-15", name: "sale", color: "#d0021b" },
                    { id: "t-16", name: "new items", color: "#000" },
                ],
                discount: 20
            }
        ]
    },
    {
        id: "3",
        slug: "d",
        name: "Designer",
        items: [
            {
                id: "9",
                imgUrl: "/brand-banners/all-saints-banner.jpg",
                tags: [
                    { id: "t-17", name: "sale", color: "#d0021b" },
                    { id: "t-18", name: "new items", color: "#000" },
                ],
                discount: 60
            },
            {
                id: "10",
                imgUrl: "/brand-banners/all-saints-banner.jpg",
                tags: [
                    { id: "t-19", name: "new items", color: "#000" },
                    { id: "t-20", name: "new discount", color: "#d0021b" },
                ],
                discount: 65
            },
            {
                id: "11",
                imgUrl: "/brand-banners/levis-banner.avif",
                tags: [
                    { id: "t-21", name: "sale", color: "#d0021b" },
                    { id: "t-22", name: "new items", color: "#000" },
                ],
                discount: 70
            },
            {
                id: "12",
                imgUrl: "/brand-banners/levis-banner.avif",
                tags: [
                    { id: "t-23", name: "sale", color: "#d0021b" },
                    { id: "t-24", name: "new discount", color: "#d0021b" },
                ],
                discount: 20
            }
        ]
    },
]

type Slug = typeof brands[number]["slug"];

export default function BrandsSwitcher() {
    const [selected, setSelected] = useState<Slug>("m-p");
    const activeItems = brands.find((b) => b.slug === selected)?.items ?? [];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-2">
                {brands.map(b => (
                    <div key={b.id}>
                        <button
                            className={cn("cursor-pointer text-[16px] font-[600] rounded-full border py-2 px-4 transition-all duration-200", {
                                ["bg-black text-white"]: selected === b.slug,
                            })}
                            onClick={() => setSelected(b.slug)}
                        >
                            {b.name}
                        </button>
                    </div>
                ))}
            </div>
            <Slider>
                {activeItems.map(i => (
                    <BrandCard brand={i}/>
                ))}
            </Slider>
        </div>
    )
}