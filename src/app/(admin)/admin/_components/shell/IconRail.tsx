"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";
import { NAV_GROUPS, groupOf } from "./nav";

/**
 * Рейл разделов. Дублирует сайдбар намеренно: в один клик из любого места
 * админки, и он же держит вертикальный ритм всего экрана.
 */
export default function IconRail() {
    const pathname = usePathname();
    const active = groupOf(pathname);

    return (
        <aside className="hidden w-[68px] shrink-0 flex-col items-center gap-3 py-3 lg:flex">
            <Link
                href="/admin"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-panel text-[15px] font-bold text-white shadow-float transition-transform duration-200 hover:scale-105"
                aria-label="Extropy admin home"
            >
                E
            </Link>

            <div className="flex flex-1 flex-col items-center gap-2 pt-3">
                {NAV_GROUPS.map((group) => {
                    const Icon = group.icon;
                    const isActive = group.id === active.id;

                    return (
                        <Link
                            key={group.id}
                            href={group.root}
                            title={group.label}
                            aria-label={group.label}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                                "group relative grid h-11 w-11 place-items-center rounded-full transition-all duration-200",
                                isActive
                                    ? "bg-accent text-white shadow-float"
                                    : "bg-card text-ink-soft shadow-card hover:text-ink",
                            )}
                        >
                            <Icon
                                className="h-[18px] w-[18px]"
                                strokeWidth={isActive ? 2.2 : 1.8}
                            />

                            {/* подпись появляется поверх контента, ширину рейла не растит */}
                            <span className="pointer-events-none absolute left-[calc(100%+10px)] z-30 rounded-lg bg-ink-panel px-2.5 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-pop transition-opacity duration-150 group-hover:opacity-100">
                                {group.label}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <Link
                href="/women"
                title="Open storefront"
                aria-label="Open storefront"
                className="grid h-11 w-11 place-items-center rounded-full bg-card text-ink-soft shadow-card transition-colors hover:text-ink"
            >
                <Store className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </Link>
        </aside>
    );
}
