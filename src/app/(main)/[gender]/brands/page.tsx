"use client"

import FavAnimIcon from "@/components/ui/icons/FavIcon/FavAnimIcon";
import {useState} from "react";

export default function BrandsPage() {
    const brandsLetters = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    const sections = [
        {
            title: "#",
            brands: ["& Other Stories", "10DAYS"]
        },
        {
            title: "A",
            brands: ["Ace & Tate", "America today", "Adidas", "American Vintage", "Alchemist", "Anne Fontaine"]
        },
        {
            title: "B",
            brands: ["Belstaff", "Bergans of Norway", "Black Bananas", "Boden"]
        },
        {
            title: "C",
            brands: ["Calvin Klein", "Cars Jeans", "Catwalk Junkie", "Closed"]
        },
        {
            title: "D",
            brands: ["Daily Paper", "Dante6", "Dsquared2", "Dstrezzed"]
        },
    ]
    const [favBrands, setFavBrands] = useState<Set<string>>(new Set())

    const toggleFav = (brand: string) => {
        setFavBrands(prev => {
            const next = new Set(prev)
            next.has(brand) ? next.delete(brand) : next.add(brand)
            return next
        })
    }

    return (
        <div className="w-full">
            <div className="max-w-[1200px] mx-auto py-6">
                <div className="flex flex-col gap-6">
                    <h1 className="text-[var(--text)] font-medium text-[clamp(30px,2vw,32px)]">BRANDS A TO Z</h1>
                    <div className="flex flex-row gap-8 items-center border-y border-gray-200 py-8">
                        {brandsLetters.map(letter => (
                            <span className="uppercase text-[var(--text)] text-[16px] leading-[133%] font-bold"
                                  key={letter}>{letter}</span>))}
                    </div>
                    <div className="flex flex-col gap-10">
                        {sections.map(section => (
                            <div key={section.title} className="flex flex-col gap-4">
                                <h2 className="text-[clamp(42px,2vw,48px)] text-[var(--text)] leading-[125%] uppercase">{section.title}</h2>
                                <div className="flex flex-row gap-10">
                                    {section.brands.map(brand => (
                                        <div key={brand} className="flex flex-row items-center gap-4">
                                            <FavAnimIcon
                                                selected={favBrands.has(brand)}
                                                onChange={() => toggleFav(brand)}
                                            />
                                            <span key={brand}>{brand}</span>
                                        </div>
                                ))}
                            </div>
                            </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}