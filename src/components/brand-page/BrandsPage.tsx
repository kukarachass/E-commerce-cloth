"use client"

import { useGenderStore } from "@/store/useGenderStore"
import Link from "next/link"
import { IBrand } from "@/types/IBrand"
import AddToFavButton from "@/components/favourites/AddToFavButton";

interface Props {
    sections: Record<string, IBrand[]>
}

export default function BrandsPage({ sections }: Props) {
    const gender = useGenderStore(s => s.gender)

    const brandsLetters = ["#", ...Object.keys(sections).sort()]

    const scrollToSection = (letter: string) => {
        const el = document.getElementById(`section-${letter}`)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    return (
        <div className="w-full">
            <div className="max-w-[1200px] mx-auto py-6">
                <div className="flex flex-col gap-6">
                    <h1 className="text-[var(--text)] font-medium text-[clamp(30px,2vw,32px)]">BRANDS A TO Z</h1>

                    <div className="flex sticky top-[50px] bg-white flex-row gap-8 items-center border-y border-gray-200 py-8 flex-wrap">
                        {brandsLetters.map(letter => (
                            <button
                                key={letter}
                                onClick={() => scrollToSection(letter)}
                                className={`uppercase text-[16px] leading-[133%] font-bold transition-colors duration-150 cursor-pointer ${
                                    sections[letter]
                                        ? "text-[var(--text)] hover:opacity-50"
                                        : "text-gray-300 cursor-default pointer-events-none"
                                }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-10">
                        {Object.entries(sections).sort().map(([letter, brands]) => (
                            <div key={letter} id={`section-${letter}`} className="flex flex-col gap-4 scroll-mt-10">
                                <h2 className="text-[clamp(42px,2vw,48px)] text-[var(--text)] leading-[125%] uppercase">
                                    {letter}
                                </h2>
                                <div className="flex flex-row gap-10 flex-wrap">
                                    {brands.map(brand => (
                                        <div key={brand.id} className="flex flex-row items-center gap-4">
                                            <AddToFavButton id={brand.id} type={"brand"}/>
                                            <Link href={`/${gender}/brands/${brand.slug}`}>
                                                {brand.name}
                                            </Link>
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