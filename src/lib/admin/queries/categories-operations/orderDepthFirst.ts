import "server-only";

import {ParentOption} from "@/lib/admin/queries/categories-operations/cat-types";

type Candidate = {
    id: string;
    name: string;
    level: number;
    parentId: string | null;
};

/** Родитель → сразу его дети → внуки. Порядок как в дереве, а не по уровням */
export default function orderDepthFirst(items: Candidate[]): ParentOption[] {
    const ids = new Set(items.map((i) => i.id));

    // Индекс: родитель → его дети
    const childrenOf = new Map<string | null, Candidate[]>();
    for (const c of items) {
        // Если родителя нет в списке (отфильтрован или из другого гендера) —
        // считаем узел корневым, иначе он бы вообще не отрисовался
        const key = c.parentId && ids.has(c.parentId) ? c.parentId : null;
        if (!childrenOf.has(key)) childrenOf.set(key, []);
        childrenOf.get(key)!.push(c);
    }

    for (const arr of childrenOf.values()) {
        arr.sort((a, b) => a.name.localeCompare(b.name));
    }

    const out: ParentOption[] = [];
    const walk = (parentId: string | null) => {
        for (const node of childrenOf.get(parentId) ?? []) {
            out.push({ id: node.id, name: node.name, level: node.level });
            walk(node.id); // сразу спускаемся к детям этого узла
        }
    };
    walk(null);

    return out;
}