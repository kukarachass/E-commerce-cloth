import cn from "@/app/(admin)/admin/_lib/cn";

export type DonutSlice = {
    label: string;
    value: number;
    color: string;
};

/**
 * Кольцевая диаграмма на stroke-dasharray: без библиотеки, без клиентского JS.
 * Пустое кольцо тоже рисуется — иначе пустой стейт выглядит как поломка.
 */
export default function Donut({
    slices,
    size = 132,
    thickness = 14,
    center,
    className,
}: {
    slices: DonutSlice[];
    size?: number;
    thickness?: number;
    center?: React.ReactNode;
    className?: string;
}) {
    const total = slices.reduce((sum, s) => sum + s.value, 0);
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const gap = total > 0 && slices.filter((s) => s.value > 0).length > 1 ? 2 : 0;

    let offset = 0;

    return (
        <div
            className={cn("relative shrink-0", className)}
            style={{ width: size, height: size }}
        >
            <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={thickness}
                    stroke="currentColor"
                    className="text-sunk"
                />

                {total > 0 &&
                    slices.map((slice) => {
                        if (slice.value <= 0) return null;
                        const length = (slice.value / total) * circumference;
                        const dash = Math.max(length - gap, 0.5);
                        const el = (
                            <circle
                                key={slice.label}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                strokeWidth={thickness}
                                stroke={slice.color}
                                strokeLinecap="round"
                                strokeDasharray={`${dash} ${circumference - dash}`}
                                strokeDashoffset={-offset}
                            />
                        );
                        offset += length;
                        return el;
                    })}
            </svg>

            {center && (
                <div className="absolute inset-0 grid place-items-center text-center">
                    {center}
                </div>
            )}
        </div>
    );
}

/** Легенда рядом с кольцом — цвет, подпись, значение */
export function DonutLegend({
    slices,
    total,
    className,
}: {
    slices: DonutSlice[];
    total?: number;
    className?: string;
}) {
    const sum = total ?? slices.reduce((s, x) => s + x.value, 0);

    return (
        <ul className={cn("grid min-w-0 flex-1 gap-2.5", className)}>
            {slices.map((slice) => (
                <li key={slice.label} className="flex items-center gap-2.5 text-sm">
                    <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: slice.color }}
                    />
                    <span className="min-w-0 flex-1 truncate text-ink-soft">
                        {slice.label}
                    </span>
                    <span className="tnum shrink-0 font-medium text-ink">
                        {slice.value}
                    </span>
                    <span className="tnum w-10 shrink-0 text-right text-xs text-ink-faint">
                        {sum > 0 ? Math.round((slice.value / sum) * 100) : 0}%
                    </span>
                </li>
            ))}
        </ul>
    );
}
