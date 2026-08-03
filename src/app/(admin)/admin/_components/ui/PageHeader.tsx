import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";

/**
 * Шапка страницы. Один компонент на всю админку, чтобы отступы и размеры
 * заголовков не разъезжались от страницы к странице.
 */
export default function PageHeader({
    title,
    count,
    description,
    actions,
    back,
    meta,
    className,
}: {
    title: ReactNode;
    /** число рядом с заголовком — «Products 248» */
    count?: number | string;
    description?: ReactNode;
    actions?: ReactNode;
    back?: { href: string; label: string };
    /** статус-бейджи под заголовком */
    meta?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("mb-6", className)}>
            {back && (
                <Link
                    href={back.href}
                    className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-ink-faint transition-colors hover:text-ink"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    {back.label}
                </Link>
            )}

            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                <div className="min-w-0">
                    <h1 className="flex items-baseline gap-2.5 text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-[28px]">
                        <span className="truncate">{title}</span>
                        {count !== undefined && (
                            <span className="tnum text-lg font-medium text-ink-faint">
                                {count}
                            </span>
                        )}
                    </h1>

                    {description && (
                        <p className="mt-1.5 max-w-xl text-sm text-ink-soft">
                            {description}
                        </p>
                    )}

                    {meta && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {meta}
                        </div>
                    )}
                </div>

                {actions && (
                    <div className="flex flex-wrap items-center gap-2">{actions}</div>
                )}
            </div>
        </div>
    );
}
