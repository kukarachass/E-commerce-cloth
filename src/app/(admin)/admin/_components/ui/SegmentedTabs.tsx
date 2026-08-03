import Link from "next/link";
import cn from "@/app/(admin)/admin/_lib/cn";

export type SegmentItem = {
    href: string;
    label: string;
    active: boolean;
    count?: number;
};

/**
 * Переключатель-сегмент на ссылках: чёрная «таблетка» едет по светлой дорожке.
 * Используется для быстрых срезов списка (статусы возвратов, вкладки клиента).
 */
export default function SegmentedTabs({
    items,
    className,
    size = "md",
}: {
    items: SegmentItem[];
    className?: string;
    size?: "sm" | "md";
}) {
    return (
        <nav
            className={cn(
                "inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-sunk p-1 scrollbar-slim",
                className,
            )}
        >
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-200",
                        size === "sm" ? "h-8 px-3.5 text-xs" : "h-9 px-4 text-sm",
                        item.active
                            ? "bg-ink-panel text-white shadow-card"
                            : "text-ink-soft hover:text-ink",
                    )}
                >
                    {item.label}
                    {item.count !== undefined && (
                        <span
                            className={cn(
                                "tnum rounded-full px-1.5 text-[10px] font-semibold",
                                item.active
                                    ? "bg-white/15 text-white"
                                    : "bg-card text-ink-faint",
                            )}
                        >
                            {item.count}
                        </span>
                    )}
                </Link>
            ))}
        </nav>
    );
}
