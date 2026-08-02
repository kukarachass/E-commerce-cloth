const LOCALE = "en-GB";

const eurFmt = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const eurCompactFmt = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
});

const numberFmt = new Intl.NumberFormat(LOCALE);

const dateFmt = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

const timeFmt = new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
});

const dayShortFmt = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "short",
});

type Numeric = number | string | null | undefined;

export function toNumber(value: Numeric): number {
    if (value === null || value === undefined) return 0;
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
}

/** €1,234.50 */
export function euro(value: Numeric) {
    return eurFmt.format(toNumber(value));
}

/** €1,235 — для плотных мест: карточек метрик, осей графиков */
export function euroShort(value: Numeric) {
    return eurCompactFmt.format(toNumber(value));
}

/** Центы из Stripe → человеческая сумма */
export function euroFromCents(cents: Numeric) {
    return eurFmt.format(toNumber(cents) / 100);
}

export function count(value: Numeric) {
    return numberFmt.format(toNumber(value));
}

/** 12 400 → 12.4k. Оси и компактные бейджи */
export function compact(value: Numeric) {
    const n = toNumber(value);
    if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
    if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
    return String(Math.round(n));
}

export function formatDate(value: Date | string | number) {
    return dateFmt.format(new Date(value));
}

export function formatDateTime(value: Date | string | number) {
    return dateTimeFmt.format(new Date(value));
}

export function formatTime(value: Date | string | number) {
    return timeFmt.format(new Date(value));
}

export function formatDayShort(value: Date | string | number) {
    return dayShortFmt.format(new Date(value));
}

/** «2 hours ago» — в списках это читается быстрее абсолютной даты */
export function timeAgo(value: Date | string | number) {
    const then = new Date(value).getTime();
    const diff = Math.round((Date.now() - then) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(value);
}

/** #a1b2c3d4 — короткая форма uuid, которой оперируют в саппорте */
export function shortId(id: string) {
    return `#${id.slice(0, 8)}`;
}

export function initials(name?: string | null, fallback = "?") {
    if (!name) return fallback;
    const parts = name.trim().split(/\s+/).slice(0, 2);
    const value = parts.map((p) => p[0]).join("");
    return value ? value.toUpperCase() : fallback;
}

/** Дельта в процентах со знаком: +7.9% / −3% */
export function signedPercent(value: number | null | undefined) {
    if (value === null || value === undefined) return null;
    const sign = value > 0 ? "+" : value < 0 ? "−" : "";
    return `${sign}${Math.abs(value)}%`;
}
