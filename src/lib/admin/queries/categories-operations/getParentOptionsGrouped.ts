import "server-only";

import getFlat from "@/lib/admin/queries/categories-operations/getFlat";
import {ParentOption} from "@/lib/admin/queries/categories-operations/cat-types";
import {getDescendantIds} from "@/lib/admin/queries/categories-operations/getDescendantIds";
import {GENDERS} from "@/lib/isGender";
import orderDepthFirst from "@/lib/admin/queries/categories-operations/orderDepthFirst";

export async function getParentOptionsGrouped(
    excludeId?: string,
): Promise<Record<string, ParentOption[]>> {
    const flat = await getFlat();

    const banned = new Set<string>();
    if (excludeId) {
        banned.add(excludeId);
        for (const id of await getDescendantIds(excludeId)) banned.add(id);
    }

    // Оставляем только допустимых кандидатов, но тащим parentId для сортировки
    const allowed = flat
        .filter((c) => !banned.has(c.id) && c.level < 3)
        .map((c) => ({
            id: c.id,
            name: c.name,
            level: c.level,
            parentId: c.parentId,
            gender: c.gender?.trim().toLowerCase() ?? "",
        }));

    const grouped: Record<string, ParentOption[]> = {};
    for (const g of GENDERS) grouped[g] = [];

    for (const g of GENDERS) {
        grouped[g] = orderDepthFirst(allowed.filter((c) => c.gender === g));
    }

    return grouped;
}