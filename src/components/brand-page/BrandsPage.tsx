"use client"

import { useGenderStore } from "@/store/useGenderStore"
import Link from "next/link"
import { IBrand } from "@/types/IBrand"
import AddToFavButton from "@/components/favourites/AddToFavButton"

interface Props {
    sections: Record<string, IBrand[]>
}

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export default function BrandsPage({ sections }: Props) {
    const gender = useGenderStore(s => s.gender)

    const sortedEntries = Object.entries(sections).sort(([a], [b]) => a.localeCompare(b))

    const scrollToSection = (letter: string) => {
        const el = document.getElementById(`section-${letter}`)
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <div className="w-full">
            <div className="max-w-[1200px] mx-auto py-8 px-6">

                {/* Header */}
                <div className="mb-6">
                    <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-gray-400 mb-1">
                        Discover
                    </p>
                    <h1 className="text-[36px] font-medium leading-none text-[var(--text)]">
                        Brands A to Z
                    </h1>
                </div>

                {/* Alphabet nav */}
                <nav
                    aria-label="Alphabet navigation"
                    className="flex flex-wrap gap-x-1 gap-y-1.5 py-3 border-y border-gray-200 sticky top-[50px] bg-white z-10 mb-8"
                >
                    {ALL_LETTERS.map(letter => {
                        const active = Boolean(sections[letter])
                        return (
                            <button
                                key={letter}
                                onClick={() => active && scrollToSection(letter)}
                                disabled={!active}
                                className={[
                                    "w-7 h-7 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors duration-150",
                                    active
                                        ? "text-[var(--text)] hover:bg-gray-100 cursor-pointer"
                                        : "text-gray-300 cursor-default"
                                ].join(" ")}
                            >
                                {letter}
                            </button>
                        )
                    })}
                </nav>

                {/* Sections */}
                <div className="flex flex-col">
                    {sortedEntries.map(([letter, brands]) => (
                        <div
                            key={letter}
                            id={`section-${letter}`}
                            className="flex gap-8 py-6 border-b border-gray-200 scroll-mt-24"
                        >
                            {/* Big letter */}
                            <span className="text-[48px] font-medium leading-none text-[var(--text)] min-w-[48px] select-none">
                                {letter}
                            </span>

                            {/* Brand list */}
                            <div className="flex flex-col pt-2.5">
                                {brands.map(brand => (
                                    <div key={brand.id} className="flex items-center gap-2 py-1">
                                        <AddToFavButton id={brand.id} type="brand" />
                                        <Link
                                            href={`/${gender}/brands/${brand.slug}`}
                                            className="text-[15px] text-[var(--text)] border-b border-transparent hover:border-gray-400 transition-colors duration-150 leading-snug"
                                        >
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
    )
}