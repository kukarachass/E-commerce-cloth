"use client"

import { type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "classnames";

interface Props {
    children: ReactNode;
    className?: string;
    gap?: number;
}

export default function Slider({ children, className, gap = 16 }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    };

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: direction === "left" ? -el.clientWidth * 0.9 : el.clientWidth * 0.9, behavior: "smooth" });
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const ro = new ResizeObserver(updateScrollState);
        ro.observe(el);
        el.addEventListener("scroll", updateScrollState);
        window.addEventListener("resize", updateScrollState);
        requestAnimationFrame(updateScrollState);
        return () => {
            ro.disconnect();
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [children]);

    return (
        <div className="relative w-full">
            <button
                onClick={() => scroll("left")}
                className={cn(
                    "absolute left-[-25px] top-1/2 -translate-y-1/2 z-10",
                    "size-8 rounded-full bg-white text-gray-700 shadow-md border-none",
                    "hidden sm:flex items-center justify-center cursor-pointer",
                    "transition-all duration-200 hover:bg-gray-100",
                    !canScrollLeft && "invisible pointer-events-none"
                )}
            >
                <ChevronLeft size={20} />
            </button>

            <button
                onClick={() => scroll("right")}
                className={cn(
                    "absolute right-[-20px] top-1/2 -translate-y-1/2 z-10",
                    "size-8 rounded-full bg-white text-gray-700 shadow-md border-none",
                    "hidden sm:flex items-center justify-center cursor-pointer",
                    "transition-all duration-200 hover:bg-gray-100",
                    !canScrollRight && "invisible pointer-events-none"
                )}
            >
                <ChevronRight size={20} />
            </button>

            <div
                ref={scrollRef}
                style={{ gap }}
                className={cn(
                    "flex overflow-x-auto snap-x snap-mandatory sm:snap-none",
                    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}