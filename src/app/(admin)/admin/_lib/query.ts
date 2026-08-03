export type SearchParams = { [key: string]: string | string[] | undefined };

/** searchParams может прийти массивом, если ключ повторился в URL */
export function first(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

/**
 * Сборка ссылки со списочными параметрами. Пустые значения выпадают,
 * поэтому «Все» в фильтре даёт чистый URL, а не ?status=all.
 */
export function buildUrl(
    base: string,
    params: Record<string, string | number | undefined | null>,
) {
    const q = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        if (value === "all") continue;
        q.set(key, String(value));
    }

    const qs = q.toString();
    return qs ? `${base}?${qs}` : base;
}
