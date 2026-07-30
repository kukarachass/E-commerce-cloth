import {db} from "@/db";
import {category} from "@/db/schema";
import {eq} from "drizzle-orm";
import {getDescendantIds} from "@/lib/admin/queries/categories-operations/getDescendantIds";

/**
 * Проверяет родителя и возвращает уровень новой категории.
 * Вся логика дерева собрана здесь, чтобы create и update
 * не могли разойтись в правилах.
 */

const MAX_LEVEL = 3;

export default async function resolveParent(parentId: string, gender: string, selfId?: string ): Promise <{ ok: true; level: number } | { ok: false; field: string; message: string }> {
    if (!parentId) return { ok: true, level: 1 };

    const parent = await db.query.category.findFirst({
        where: eq(category.id, parentId),
        columns: { id: true, gender: true, level: true },
    });

    if (!parent) {
        return { ok: false, field: "parentId", message: "Родитель не найден" };
    }

    if (parent.gender !== gender) {
        return {
            ok: false,
            field: "parentId",
            message: "Родитель должен быть того же гендера",
        };
    }

    if (parent.level >= MAX_LEVEL) {
        return {
            ok: false,
            field: "parentId",
            message: `Максимум ${MAX_LEVEL} уровня вложенности`,
        };
    }

    // Защита от цикла: родителем не может быть свой же потомок
    if (selfId) {
        if (parentId === selfId) {
            return { ok: false, field: "parentId", message: "Категория не может быть своим родителем" };
        }
        const descendants = await getDescendantIds(selfId);
        if (descendants.includes(parentId)) {
            return {
                ok: false,
                field: "parentId",
                message: "Нельзя выбрать родителем свою подкатегорию",
            };
        }
    }

    return { ok: true, level: parent.level + 1 };
}