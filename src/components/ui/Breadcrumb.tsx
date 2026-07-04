"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
    className?: string;
}

// сегменты, которые не должны попадать в хлебные крошки
const EXCLUDED_SEGMENTS = new Set(["women", "men", "new-items", "product"]);

export default function Breadcrumb({ className }: Props) {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);

    const items = [
        { label: "Home", href: "/" },
        ...segments
            .map((segment, index) => ({
                segment,
                label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
                // href строим от ПОЛНОГО пути, а не от отфильтрованного индекса
                href: "/" + segments.slice(0, index + 1).join("/"),
            }))
            .filter(({ segment }) => !EXCLUDED_SEGMENTS.has(segment)),
    ];

    return (
        <nav className={`${className} flex items-center gap-2`}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <div key={item.href} className="flex items-center gap-2">
                        {!isLast ? (
                            <Link
                                href={item.href}
                                className="text-[#999] text-[14px] hover:text-[#333] transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[#999] text-[14px]">
                                {item.label}
                            </span>
                        )}
                        {!isLast && (
                            <span className="text-[#999] text-[14px]">›</span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}