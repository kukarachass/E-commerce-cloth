"use client";

import { useMemo, useRef, useState } from "react";
import cn from "@/app/(admin)/admin/_lib/cn";
import { count, euroShort } from "@/app/(admin)/admin/_lib/format";
import { buildPoints, niceMax, smoothPath } from "./chart-math";

export type TrendSeriesPoint = {
    label: string;
    value: number;
    /** вторая метрика, показывается в подсказке (например, число заказов) */
    secondary?: number;
};

/** Форматтер живёт внутри: функции нельзя передать из серверного компонента */
const FORMATTERS = {
    currency: euroShort,
    number: count,
} as const;

const W = 720;
const H = 200;

/**
 * Площадной график выручки. Написан руками: библиотека сюда затащила бы
 * ~40 КБ ради одной кривой, а нам нужны свои штриховки, свой хвост и своя
 * подсказка, приклеенная к точке.
 */
export default function TrendChart({
    data,
    format = "currency",
    secondaryLabel,
    className,
    accent = "#e4265c",
}: {
    data: TrendSeriesPoint[];
    format?: keyof typeof FORMATTERS;
    /** подпись второй метрики в подсказке, например «orders» */
    secondaryLabel?: string;
    className?: string;
    accent?: string;
}) {
    const [hover, setHover] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const formatValue = FORMATTERS[format];

    const { points, path, area, max, avgY } = useMemo(() => {
        const values = data.map((d) => d.value);
        const peak = niceMax(Math.max(...values, 1));
        const pts = buildPoints(values, W, H, peak);
        const line = smoothPath(pts);
        const avg = values.reduce((s, v) => s + v, 0) / (values.length || 1);

        return {
            points: pts,
            path: line,
            area: `${line} L ${W} ${H} L 0 ${H} Z`,
            max: peak,
            avgY: H - (avg / peak) * H,
        };
    }, [data]);

    if (data.length === 0) return null;

    const onMove = (clientX: number) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const ratio = (clientX - rect.left) / rect.width;
        const index = Math.round(ratio * (data.length - 1));
        setHover(Math.max(0, Math.min(data.length - 1, index)));
    };

    const active = hover === null ? null : data[hover];
    const activePoint = hover === null ? null : points[hover];

    return (
        <div className={cn("relative", className)}>
            <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="h-auto w-full touch-none overflow-visible"
                onMouseMove={(e) => onMove(e.clientX)}
                onMouseLeave={() => setHover(null)}
                onTouchStart={(e) => onMove(e.touches[0].clientX)}
                onTouchMove={(e) => onMove(e.touches[0].clientX)}
                onTouchEnd={() => setHover(null)}
                role="img"
                aria-label="Revenue trend"
            >
                <defs>
                    <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={accent} stopOpacity="0" />
                    </linearGradient>
                    <pattern
                        id="trend-hatch"
                        width="6"
                        height="6"
                        patternTransform="rotate(-45)"
                        patternUnits="userSpaceOnUse"
                    >
                        <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="6"
                            stroke={accent}
                            strokeOpacity="0.16"
                            strokeWidth="1.4"
                        />
                    </pattern>
                </defs>

                {/* сетка */}
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                    <line
                        key={t}
                        x1={0}
                        x2={W}
                        y1={H * t}
                        y2={H * t}
                        stroke="currentColor"
                        className="text-line"
                        strokeWidth="1"
                        strokeDasharray={t === 1 ? undefined : "2 6"}
                    />
                ))}

                {/* средняя за период — ориентир «выше/ниже обычного» */}
                <line
                    x1={0}
                    x2={W}
                    y1={avgY}
                    y2={avgY}
                    stroke={accent}
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                />

                {/* заливка проявляется, линия прочерчивается —
                    pathLength="1" делает длину предсказуемой для keyframes */}
                <g className="animate-fade" style={{ animationDelay: "0.35s" }}>
                    <path d={area} fill="url(#trend-fill)" />
                    <path d={area} fill="url(#trend-hatch)" opacity="0.5" />
                </g>
                <path
                    d={path}
                    pathLength={1}
                    className="animate-draw"
                    fill="none"
                    stroke={accent}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {activePoint && (
                    <g>
                        <line
                            x1={activePoint.x}
                            x2={activePoint.x}
                            y1={0}
                            y2={H}
                            stroke="currentColor"
                            className="text-ink"
                            strokeOpacity="0.18"
                            strokeWidth="1"
                        />
                        <circle
                            cx={activePoint.x}
                            cy={activePoint.y}
                            r="9"
                            fill={accent}
                            fillOpacity="0.15"
                        />
                        <circle
                            cx={activePoint.x}
                            cy={activePoint.y}
                            r="4.5"
                            fill="#fff"
                            stroke={accent}
                            strokeWidth="2.5"
                        />
                    </g>
                )}
            </svg>

            {/* потолок оси подписываем прямо на верхней линии сетки */}
            <span className="tnum pointer-events-none absolute top-0 right-0 -translate-y-1/2 rounded bg-card px-1 text-[10px] text-ink-faint">
                {formatValue(max)}
            </span>

            {/* подсказка */}
            {active && activePoint && (
                <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-full pb-3"
                    style={{
                        left: `${(activePoint.x / W) * 100}%`,
                        top: `${(activePoint.y / H) * 100}%`,
                    }}
                >
                    <div className="rounded-xl bg-ink-panel px-3 py-2 text-white shadow-pop">
                        <div className="text-[10px] tracking-wide text-white/55 uppercase">
                            {active.label}
                        </div>
                        <div className="tnum text-sm font-semibold">
                            {formatValue(active.value)}
                        </div>
                        {active.secondary !== undefined && (
                            <div className="tnum text-[11px] text-white/60">
                                {count(active.secondary)} {secondaryLabel}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ось X: показываем не все дни, иначе подписи слипнутся.
                grid с minmax(0,1fr) — чтобы подписи не распирали карточку */}
            <div
                className="mt-2 grid grid-cols-1 text-[10px] text-ink-faint"
                style={{
                    gridTemplateColumns: `repeat(${data.length}, minmax(0,1fr))`,
                }}
            >
                {data.map((d, i) => {
                    const every = Math.ceil(data.length / 7);
                    const show = i % every === 0 || i === data.length - 1;
                    return (
                        <span
                            key={d.label + i}
                            className={cn(
                                "tnum overflow-visible text-center whitespace-nowrap transition-colors",
                                !show && "opacity-0",
                                hover === i && "font-semibold text-ink opacity-100",
                            )}
                        >
                            {d.label}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
