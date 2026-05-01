"use client"

import styles from "./slider.module.css"
import {type ReactNode, useEffect, useRef, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import cn from "classnames";

interface Props {
    children: ReactNode;
}

export default function Slider({ children }: Props) {
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
        const amount = el.clientWidth * 0.9;
        el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    };

    useEffect(() => {
        updateScrollState();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", updateScrollState);
        window.addEventListener("resize", updateScrollState);
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.btnsWrapper}>
                {canScrollLeft && (
                    <button className={`${styles.button} ${styles.left}`} onClick={() => scroll("left")}>
                        <ChevronLeft size={20} />
                    </button>
                )}

                {canScrollRight && (
                    <button className={`${styles.button} ${styles.right}`} onClick={() => scroll("right")}>
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>

            <div ref={scrollRef} className={cn(`${styles.track} ${styles || ""}`)}>
                {children}
            </div>
        </div>
    );
}