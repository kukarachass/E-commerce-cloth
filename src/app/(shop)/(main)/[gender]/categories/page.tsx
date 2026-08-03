"use client"

import Link from "next/link";
import Image from "next/image";
import {useState, useRef, useCallback, useMemo} from "react";
import {useGender} from "@/hooks/useGender";

interface Category {
    name: string;
    img: string;
    href: string;
    tag: string;
}

export default function CategoriesPage() {
    const gender = useGender();
    // const data: Category[] = [
    //     {name: "Bags", img: "/category/bags.png", href: `/${gender}/accessories/bags`, tag: "Accessories"},
    //     {name: "Dresses", img: "/category/dress.jpg", href: `/${gender}/clothing/dresses`, tag: "Clothing"},
    //     {name: "Jeans", img: "/category/jeans.jpg", href: `/${gender}/clothing/jeans`, tag: "Clothing"},
    //     {name: "Trainers", img: "/category/sneak.png", href: `/${gender}/shoes/trainers`, tag: "Shoes"},
    //     {name: "Sportswear", img: "/category/sports.png", href: `/${gender}/sportswear`, tag: "Active"},
    //     {name: "T-Shirts", img: "/category/tops.png", href: `/${gender}/clothing/shirts-and-tops`, tag: "Clothing"},
    // ];

    const womenCat = [
        { id: "1", name: "Dresses", img: "/pop-cat/women/dress.jpg", href: `/women/clothing/dresses`, tag: "Clothing"},
        { id: "2", name: "Jeans", img: "/pop-cat/women/jeans.jpg", href: `/women/clothing/jeans`, tag: "Clothing"},
        { id: "3", name: "T-Shirts", img: "/pop-cat/women/tops.png", href: `/women/clothing/shirts-and-tops`, tag: "Clothing"},

        { id: "4", name: "Trainers", img: "/pop-cat/women/sneak.png", href: `/women/shoes/trainers`, tag: "Clothing"},
        { id: "5", name: "Bags", img: "/pop-cat/women/bags.png", href: `/women/accessories/bags`, tag: "Accessories"},
        { id: "6", name: "Sportswear", img: "/pop-cat/women/sports.png", href: `/women/sportswear`, tag: "Sportswear"}
    ]

    const menCat = [
        { id: "1", name: "T-shirts", img: "/pop-cat/men/pop-cat-t-shirt.png", href: `men/clothing/t-shirts-and-polos`, tag: "Clothing"},
        { id: "2", name: "Jeans", img: "/pop-cat/men/pop-cat-jeans.png", href: `/men/clothing/jeans`, tag: "Clothing"},
        { id: "3", name: "Trainers", img: "/pop-cat/men/pop-cat-trainers.png", href: `/men/clothing/trainers`, tag: "Clothing"},

        { id: "4", name: "Jackets", img: "/pop-cat/men/pop-cat-jackets.jpg", href: `/men/shoes/jackets`, tag: "Clothing"},
        { id: "5", name: "Shirts", img: "/pop-cat/men/pop-cat-shirts.png", href: `/men/accessories/shirts`, tag: "Clothing"},
        { id: "6", name: "Sports Clothing & Apparel", img: "/pop-cat/men/pop-cat-sports.png", href: `/men/sportswear`, tag: "Sportswear"}
    ]

    const data: Category[] = gender === "men" ? menCat : womenCat;

    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [pos, setPos] = useState({x: 0, y: 0});
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({x: e.clientX - rect.left, y: e.clientY - rect.top});
    }, []);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative max-w-[1200px] mx-auto p-5"
        >
            {/* Floating preview */}
            {previewImg && (
                <div
                    className="absolute pointer-events-none z-50 w-[180px] h-[220px] rounded-[4px] overflow-hidden shadow-2xl transition-opacity duration-300"
                    style={{left: pos.x + 28, top: pos.y - 110}}
                >
                    <Image
                        src={previewImg}
                        alt="preview"
                        fill
                        className="object-cover rounded-[10px]"
                        sizes="180px"
                    />
                </div>
            )}

            {/* Header */}
            <div className="mt-6 mb-10">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-2">
                    Browse by style
                </p>
                <h1 className="font-playfair italic font-black text-[52px] leading-none text-[var(--text)]">
                    Categories
                </h1>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200"/>

            {/* List */}
            <ul className="m-0 p-0 list-none">
                {data.map((category, i) => (
                    <li key={category.name}>
                        <Link
                            href={category.href}
                            onMouseEnter={() => setPreviewImg(category.img)}
                            onMouseLeave={() => setPreviewImg(null)}
                            className="group flex items-center justify-between py-5 border-b border-gray-200 no-underline transition-all duration-300 ease-in-out hover:pl-4"
                        >
                            <div className="flex items-center gap-6">
                                    <span className="text-[11px] text-gray-400 font-normal tracking-wide min-w-[24px]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                <span
                                    className="italic font-[600] text-[32px] leading-none text-[var(--text)] transition-all duration-300 ease-in-out group-hover:tracking-wide">
                                        {category.name}
                                    </span>
                                <span
                                    className="text-[11px] font-normal tracking-[0.12em] uppercase text-gray-400 border border-gray-200 px-2.5 py-0.5 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 ease-in-out">
                                        {category.tag}
                                    </span>
                            </div>

                            {/* Arrow: diagonal → horizontal on hover */}
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-400 group-hover:text-[var(--text)] transition-all duration-300 ease-in-out -rotate-45 group-hover:rotate-0"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between mt-8">
                    <span className="text-[12px] text-gray-400">
                        {data.length} categories available
                    </span>
            </div>
        </div>
    );
}