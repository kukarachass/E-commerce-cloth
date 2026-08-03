export type Point = { x: number; y: number };

/**
 * Catmull-Rom → cubic bezier. Даёт мягкую линию, которая проходит ровно
 * через точки данных (в отличие от сглаживания «на глаз»).
 */
export function smoothPath(points: Point[], tension = 0.5) {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;

        const c1x = p1.x + ((p2.x - p0.x) / 6) * tension;
        const c1y = p1.y + ((p2.y - p0.y) / 6) * tension;
        const c2x = p2.x - ((p3.x - p1.x) / 6) * tension;
        const c2y = p2.y - ((p3.y - p1.y) / 6) * tension;

        d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }

    return d;
}

/** «Красивый» потолок оси: 3480 → 4000, чтобы подписи были круглыми */
export function niceMax(value: number) {
    if (value <= 0) return 1;
    const magnitude = 10 ** Math.floor(Math.log10(value));
    const normalized = value / magnitude;
    const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
    return step * magnitude;
}

export function buildPoints(
    values: number[],
    width: number,
    height: number,
    max: number,
): Point[] {
    const step = values.length > 1 ? width / (values.length - 1) : 0;
    return values.map((v, i) => ({
        x: values.length > 1 ? i * step : width / 2,
        y: height - (max > 0 ? (v / max) * height : 0),
    }));
}
