"use client";

import { useState } from "react";

export default function FooterSection({ section }: { section: { title: string; text: string[] } }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col min-[880px]:gap-3">
            {/* Mobile: кликабельный заголовок */}
            <button
                className="flex min-[880px]:cursor-default items-center justify-between w-full min-[880px]:pointer-events-none"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <h3 className="text-white font-bold text-[clamp(18px,2vw,24px)] min-[880px]:mb-2 py-4 min-[880px]:py-0">
                    {section.title}
                </h3>
                {/* Иконка только на мобиле */}
                <div className="min-[880px]:hidden border-t-[3px] border-r-[3px] border-[#999] w-[10px] h-[10px]" />            </button>

            {/* Контент: на десктопе всегда видно, на мобиле — только если открыт */}
            <div
                className={`
                    flex flex-col gap-3 overflow-hidden transition-all duration-300
                    min-[880px]:flex min-[880px]:max-h-none min-[880px]:opacity-100
                    ${isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"}
                `}
            >
                {section.text.map((item) => (
                    <span
                        key={item}
                        className="text-[var(--header-muted)] text-[16px] leading-[150%] cursor-pointer hover:text-white transition-colors"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}