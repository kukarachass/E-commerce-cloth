import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { category } from "@/db/schema";

export type CategoryOption = { id: string; name: string; level: number };
export type CategoryGroup = { gender: string; label: string; items: CategoryOption[] };

const LABELS: Record<string, string> = {
    women: "Женское", men: "Мужское",
};

export async function getCategoryGroups(): Promise<CategoryGroup[]> {
    const rows = await db
        .select({
            id: category.id, name: category.name, gender: category.gender,
            level: category.level, parentId: category.parentId,
        })
        .from(category)
        .orderBy(asc(category.name));

    // группируем по гендеру
    const byGender = new Map<string, typeof rows>();
    for (const c of rows) {
        if (!byGender.has(c.gender)) byGender.set(c.gender, []);
        byGender.get(c.gender)!.push(c);
    }

    return [...byGender].map(([gender, items]) => {
        // индекс: родитель -> дети
        const children = new Map<string | null, typeof items>();
        const ids = new Set(items.map((i) => i.id));
        for (const c of items) {
            const key = c.parentId && ids.has(c.parentId) ? c.parentId : null;
            if (!children.has(key)) children.set(key, []);
            children.get(key)!.push(c);
        }

        // обход в глубину: родитель, под ним его дети
        const out: CategoryOption[] = [];
        const walk = (parentId: string | null) => {
            for (const c of children.get(parentId) ?? []) {
                out.push({ id: c.id, name: c.name, level: c.level });
                walk(c.id);
            }
        };
        walk(null);

        return { gender, label: LABELS[gender] ?? gender, items: out };
    });
}