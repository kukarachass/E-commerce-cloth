"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);

    const items = [
        { label: "Home", href: "/" },
        ...segments.map((segment, index) => ({
            label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
            href: "/" + segments.slice(0, index + 1).join("/"),
        })),
    ];

    return (
        <nav className="flex items-center gap-2">
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