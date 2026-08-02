import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";

/**
 * Одно описание колонок — две раскладки.
 *
 * ≥ lg   строки-гриды с общим шаблоном треков (табличный вид, но без <table>:
 *        строку целиком можно сделать ссылкой и не воевать с вложением <a> в <tr>);
 * < lg   те же данные карточками, где `mobile` решает, что попадёт в шапку,
 *        что уедет вправо, а что станет строкой «label — value».
 */
export type Column<T> = {
    key: string;
    header?: ReactNode;
    /** трек грида: "180px", "minmax(0,2fr)". По умолчанию minmax(0,1fr) */
    width?: string;
    align?: "left" | "right" | "center";
    cell: (row: T) => ReactNode;
    /** роль колонки в мобильной карточке */
    mobile?: "title" | "trailing" | "meta" | "hide";
    /** подпись в мобильной карточке, если отличается от header */
    label?: string;
    className?: string;
};

interface DataTableProps<T> {
    columns: Column<T>[];
    rows: T[];
    getKey: (row: T) => string;
    /** делает строку ссылкой целиком */
    href?: (row: T) => string;
    empty?: ReactNode;
    className?: string;
}

const ALIGN: Record<NonNullable<Column<unknown>["align"]>, string> = {
    left: "justify-start text-left",
    right: "justify-end text-right",
    center: "justify-center text-center",
};

export default function DataTable<T>({
    columns,
    rows,
    getKey,
    href,
    empty,
    className,
}: DataTableProps<T>) {
    if (rows.length === 0) return <>{empty}</>;

    const template = columns
        .map((c) => c.width ?? "minmax(0,1fr)")
        .concat(href ? ["24px"] : [])
        .join(" ");

    const titleCols = columns.filter((c) => c.mobile === "title");
    const trailingCols = columns.filter((c) => c.mobile === "trailing");
    const metaCols = columns.filter(
        (c) => c.mobile !== "hide" && c.mobile !== "title" && c.mobile !== "trailing",
    );

    return (
        <div className={cn("min-w-0", className)}>
            {/* ── шапка (только широкий экран) ── */}
            <div
                className="hidden items-center gap-4 border-b border-line px-3 pb-2.5 text-[11px] font-medium tracking-[0.06em] text-ink-faint uppercase lg:grid"
                style={{ gridTemplateColumns: template }}
            >
                {columns.map((c) => (
                    <div
                        key={c.key}
                        className={cn(
                            "flex min-w-0 items-center",
                            ALIGN[c.align ?? "left"],
                        )}
                    >
                        <span className="truncate">{c.header}</span>
                    </div>
                ))}
                {href && <span />}
            </div>

            <ul className="grid gap-2 lg:gap-0">
                {rows.map((row) => {
                    const key = getKey(row);
                    const target = href?.(row);

                    const body = (
                        <>
                            {/* широкий экран: грид-строка */}
                            <div
                                className="hidden items-center gap-4 lg:grid"
                                style={{ gridTemplateColumns: template }}
                            >
                                {columns.map((c) => (
                                    <div
                                        key={c.key}
                                        className={cn(
                                            "flex min-w-0 items-center text-sm",
                                            ALIGN[c.align ?? "left"],
                                            c.className,
                                        )}
                                    >
                                        {c.cell(row)}
                                    </div>
                                ))}
                                {target && (
                                    <ChevronRight className="h-4 w-4 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                                )}
                            </div>

                            {/* узкий экран: карточка */}
                            <div className="grid gap-3 lg:hidden">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1 space-y-1">
                                        {titleCols.map((c) => (
                                            <div key={c.key} className="min-w-0 text-sm">
                                                {c.cell(row)}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1.5 text-sm">
                                        {trailingCols.map((c) => (
                                            <div key={c.key}>{c.cell(row)}</div>
                                        ))}
                                    </div>
                                </div>

                                {metaCols.length > 0 && (
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 sm:grid-cols-3">
                                        {metaCols.map((c) => (
                                            <div key={c.key} className="min-w-0">
                                                <dt className="mb-1 truncate text-[10px] font-medium tracking-[0.06em] text-ink-faint uppercase">
                                                    {c.label ?? c.header}
                                                </dt>
                                                <dd className="min-w-0 truncate text-sm">
                                                    {c.cell(row)}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                )}
                            </div>
                        </>
                    );

                    const rowClass = cn(
                        "group block rounded-card p-4 transition-colors",
                        "lg:rounded-xl lg:px-3 lg:py-3",
                        "bg-card shadow-card lg:bg-transparent lg:shadow-none",
                        "lg:border-b lg:border-line lg:last:border-0",
                        target && "cursor-pointer hover:bg-sunk lg:hover:bg-sunk",
                    );

                    return (
                        <li key={key} className="min-w-0">
                            {target ? (
                                <Link href={target} className={rowClass}>
                                    {body}
                                </Link>
                            ) : (
                                <div className={rowClass}>{body}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

/** Ячейка «картинка + две строки текста» — самый частый паттерн в списках */
export function MediaCell({
    image,
    fallback,
    title,
    subtitle,
    square,
}: {
    image?: string | null;
    fallback?: ReactNode;
    title: ReactNode;
    subtitle?: ReactNode;
    square?: boolean;
}) {
    return (
        <div className="flex min-w-0 items-center gap-3">
            <div
                className={cn(
                    "hatch grid shrink-0 place-items-center overflow-hidden rounded-lg bg-sunk",
                    square ? "h-10 w-10" : "h-12 w-10",
                )}
            >
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={image}
                        alt=""
                        loading="lazy"
                        className={cn(
                            "h-full w-full",
                            square ? "object-contain p-1" : "object-cover",
                        )}
                    />
                ) : (
                    fallback
                )}
            </div>
            <div className="min-w-0">
                <div className="truncate font-medium text-ink">{title}</div>
                {subtitle && (
                    <div className="truncate text-xs text-ink-faint">{subtitle}</div>
                )}
            </div>
        </div>
    );
}
