import Link from "next/link";
import type { ReactNode } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";

/**
 * Компактная строка списка внутри карточки: ведущий элемент, два уровня
 * текста и значение справа. Используется в очередях дашборда и сводках.
 */
export default function ListRow({
    href,
    leading,
    title,
    subtitle,
    value,
    valueHint,
    footer,
    className,
}: {
    href?: string;
    leading?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    value?: ReactNode;
    valueHint?: ReactNode;
    footer?: ReactNode;
    className?: string;
}) {
    const content = (
        <>
            <div className="flex items-center gap-3">
                {leading}

                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{title}</div>
                    {subtitle && (
                        <div className="truncate text-xs text-ink-faint">{subtitle}</div>
                    )}
                </div>

                {value !== undefined && (
                    <div className="shrink-0 text-right">
                        <div className="tnum text-sm font-semibold text-ink">{value}</div>
                        {valueHint && (
                            <div className="text-[11px] text-ink-faint">{valueHint}</div>
                        )}
                    </div>
                )}
            </div>

            {footer && <div className="mt-2.5">{footer}</div>}
        </>
    );

    const base = cn(
        "block rounded-xl px-2.5 py-2.5 transition-colors",
        href && "hover:bg-sunk",
        className,
    );

    return href ? (
        <Link href={href} className={base}>
            {content}
        </Link>
    ) : (
        <div className={base}>{content}</div>
    );
}
