import "server-only";
import getFlat from "@/lib/admin/queries/categories-operations/getFlat";
import {CategoryTreeNode} from "@/lib/admin/queries/categories-operations/cat-types";

export async function getCategoryTree() {
    const flat = await getFlat();

    const nodes = new Map<string, CategoryTreeNode>();
    for (const row of flat) {
        nodes.set(row.id, {
            ...row,
            productCount: Number(row.productCount),
            children: [],
        });
    }

    const roots: CategoryTreeNode[] = [];
    for (const node of nodes.values()) {
        const parent = node.parentId ? nodes.get(node.parentId) : null;
        if (parent) parent.children.push(node);
        else roots.push(node);
    }

    return roots;
}