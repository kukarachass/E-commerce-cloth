"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import cn from "classnames";
interface ScrollContainerProps {
    children: React.ReactNode;
    className?: string;
    gap?: number; // px
}

export default function ScrollContainer({
                                            children,
                                            className,
                                            gap = 16,
                                        }: ScrollContainerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const update = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }, []);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        update();
        el.addEventListener("scroll", update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", update);
            ro.disconnect();
        };
    }, [update]);

    const scroll = (dir: "left" | "right") => {
        const el = ref.current;
        if (!el) return;
        const amount = el.clientWidth * 0.75;
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    return (
        <div className="relative group/scroll">
            {/* Fade edges */}
            <div
                className={cn(
                    "pointer-events-none absolute left-0 top-0 h-full w-16 z-10 ",
                    canScrollLeft ? "opacity-100" : "opacity-0"
                )}
            />
            <div
                className={cn(
                    "pointer-events-none absolute right-0 top-0 h-full w-16 z-10 ",
                    canScrollRight ? "opacity-100" : "opacity-0"
                )}
            />

            {/* Arrows */}
            <ArrowBtn side="left" visible={canScrollLeft} onClick={() => scroll("left")} />
            <ArrowBtn side="right" visible={canScrollRight} onClick={() => scroll("right")} />

            {/* Track */}
            <div
                ref={ref}
                style={{ gap }}
                className={cn(
                    "max-w-[1200px] flex overflow-x-auto scrollbar-hide scroll-smooth",
                    className
                )}
            >
                {children}
            </div>
        </div>
    );
}

function ArrowBtn({
                      side,
                      visible,
                      onClick,
                  }: {
    side: "left" | "right";
    visible: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            aria-label={side === "left" ? "Scroll left" : "Scroll right"}
            className={cn(
                "absolute top-1/2 -translate-y-1/2 z-20",
                "size-9 rounded-full bg-white border border-neutral-200 shadow-md",
                "flex items-center justify-center",
                "transition-all duration-200 hover:scale-110 active:scale-95",
                side === "left" ? "left-2" : "right-2",
                visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
        >
            {side === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
    );
}