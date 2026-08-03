import { FolderTree, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getCategoryTree } from "@/lib/admin/queries/categories-operations/getCategoryTree";
import type { CategoryTreeNode } from "@/lib/admin/queries/categories-operations/cat-types";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card, { CardHeader } from "@/app/(admin)/admin/_components/ui/Card";
import CategoryNode from "@/app/(admin)/admin/_components/category/CategoryNode";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import { LinkButton } from "@/app/(admin)/admin/_components/ui/Button";
import { StatCard } from "@/app/(admin)/admin/_components/ui/Metric";
import { GENDER_LABELS } from "@/app/(admin)/admin/_lib/labels";

function countNodes(nodes: CategoryTreeNode[]): number {
    return nodes.reduce((sum, node) => sum + 1 + countNodes(node.children), 0);
}

function sumProducts(nodes: CategoryTreeNode[]): number {
    return nodes.reduce(
        (sum, node) => sum + node.productCount + sumProducts(node.children),
        0,
    );
}

function deepestLevel(nodes: CategoryTreeNode[]): number {
    return nodes.reduce(
        (max, node) => Math.max(max, node.level, deepestLevel(node.children)),
        0,
    );
}

export default async function CategoriesPage() {
    await requireAdmin();
    const roots = await getCategoryTree();

    // Корни группируем по гендеру — это две независимые навигации магазина
    const byGender = new Map<string, CategoryTreeNode[]>();
    for (const root of roots) {
        if (!byGender.has(root.gender)) byGender.set(root.gender, []);
        byGender.get(root.gender)!.push(root);
    }

    const totalCategories = countNodes(roots);
    const totalProducts = sumProducts(roots);

    return (
        <>
            <PageHeader
                title="Categories"
                count={totalCategories}
                description="The navigation tree customers browse. Up to three levels deep."
                actions={
                    <LinkButton href="/admin/categories/new" variant="primary">
                        <Plus className="h-4 w-4" />
                        New category
                    </LinkButton>
                }
            />

            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatCard
                    label="Top-level sections"
                    value={roots.length}
                    sub="root categories across audiences"
                    icon={FolderTree}
                />
                <StatCard
                    label="Tree depth"
                    value={deepestLevel(roots) || 0}
                    sub="levels currently in use"
                    variant="sunk"
                />
                <StatCard
                    label="Categorised products"
                    value={totalProducts}
                    sub="active products with a category"
                    variant="dark"
                />
            </div>

            {roots.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={FolderTree}
                        title="The tree is empty"
                        description="Create a root category first, then nest the rest under it."
                        action={
                            <LinkButton
                                href="/admin/categories/new"
                                variant="primary"
                                size="sm"
                            >
                                <Plus className="h-4 w-4" />
                                New category
                            </LinkButton>
                        }
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {[...byGender].map(([gender, items]) => (
                        <Card key={gender}>
                            <CardHeader
                                title={GENDER_LABELS[gender] ?? gender}
                                hint={`${countNodes(items)} categories`}
                            />
                            {/* дерево бывает на сотни узлов — держим его в своей
                                прокрутке, чтобы страница не превращалась в километр */}
                            <ul className="-mx-2.5 grid grid-cols-1 max-h-[520px] overflow-y-auto pr-1 scrollbar-slim">
                                {items.map((node) => (
                                    <CategoryNode key={node.id} node={node} />
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}
