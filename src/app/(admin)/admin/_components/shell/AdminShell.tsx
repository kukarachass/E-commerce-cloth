"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { NavCounts } from "@/lib/admin/queries/admin-queries/getNavCounts";
import IconRail from "./IconRail";
import SidebarNav from "./SidebarNav";
import Topbar, { type AdminUser } from "./Topbar";

/**
 * Каркас админки: рейл разделов → шапка → сайдбар → рабочая область.
 *
 * На широком экране высота фиксирована (скроллится только контент — шапка и
 * навигация всегда под рукой), на узком возвращаемся к обычному скроллу
 * страницы, а навигация уезжает в выдвижную панель.
 */
export default function AdminShell({
    user,
    counts,
    children,
}: {
    user: AdminUser;
    counts: NavCounts;
    children: React.ReactNode;
}) {
    // выдвижную панель закрывает сам переход по ссылке (onNavigate),
    // поэтому синхронизация с pathname не нужна
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    return (
        <div className="flex min-h-dvh gap-3 p-2 sm:p-3 lg:h-dvh lg:overflow-hidden">
            <IconRail />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Topbar
                    user={user}
                    counts={counts}
                    onOpenMenu={() => setMenuOpen(true)}
                />

                <div className="flex min-h-0 flex-1 gap-3">
                    <aside className="hidden w-[224px] shrink-0 flex-col lg:flex">
                        <SidebarNav counts={counts} />
                    </aside>

                    <main
                        id="admin-main"
                        className="min-w-0 flex-1 rounded-panel bg-panel p-4 shadow-card sm:p-6 lg:overflow-x-hidden lg:overflow-y-auto scrollbar-slim"
                    >
                        <div className="animate-rise mx-auto w-full max-w-[1240px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* мобильная навигация */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() => setMenuOpen(false)}
                        className="animate-fade absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
                    />

                    <div className="animate-slide-left absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col gap-4 bg-canvas p-4 shadow-pop">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="grid grid-cols-1 h-10 w-10 place-items-center rounded-full bg-ink-panel text-sm font-bold text-white">
                                    E
                                </span>
                                <div className="leading-tight">
                                    <div className="text-sm font-semibold text-ink">
                                        Extropy
                                    </div>
                                    <div className="text-[11px] text-ink-faint">
                                        Admin console
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                aria-label="Close navigation"
                                className="grid grid-cols-1 h-9 w-9 place-items-center rounded-full bg-card text-ink-soft shadow-card"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <SidebarNav
                            counts={counts}
                            onNavigate={() => setMenuOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
