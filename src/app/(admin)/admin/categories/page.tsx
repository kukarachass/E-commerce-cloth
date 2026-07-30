import Link from "next/link";
import { requireAdmin } from "@/lib/admin/rbac";
import CategoryNode from "@/app/(admin)/admin/_components/category/CategoryNode";
import {CategoryTreeNode} from "@/lib/admin/queries/categories-operations/cat-types";
import {getCategoryTree} from "@/lib/admin/queries/categories-operations/getCategoryTree";

const GENDER_LABEL: Record<string, string> = {
    women: "Женское",
    men: "Мужское",
    unisex: "Унисекс",
};

export default async function CategoriesPage() {
    await requireAdmin();
    const roots = await getCategoryTree();

    // Группируем корни по гендеру
    const byGender = new Map<string, CategoryTreeNode[]>();
    for (const r of roots) {
        if (!byGender.has(r.gender)) byGender.set(r.gender, []);
        byGender.get(r.gender)!.push(r);
    }

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl">Категории</h1>
                <Link
                    href="/admin/categories/new"
                    className="px-4 py-2 bg-black text-white rounded-md"
                >
                    Добавить категорию
                </Link>
            </div>

            {roots.length === 0 && (
                <p className="text-gray-500 py-8 text-center">Категорий пока нет</p>
            )}

            {[...byGender].map(([gender, items]) => (
                <section key={gender} className="mb-6">
                    <div className="text-sm text-gray-500 mb-2">
                        {GENDER_LABEL[gender] ?? gender}
                    </div>
                    <div className="border rounded-md divide-y">
                        {items.map((node) => (
                            <CategoryNode key={node.id} node={node} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

