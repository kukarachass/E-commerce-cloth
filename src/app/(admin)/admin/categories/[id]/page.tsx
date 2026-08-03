import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import { getParentOptionsGrouped } from "@/lib/admin/queries/categories-operations/getParentOptionsGrouped";
import { getCategoryById } from "@/lib/admin/queries/categories-operations/getCategoryById";
import CategoryForm from "@/app/(admin)/admin/_components/category/CategoryForm";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import { GENDER_LABELS } from "@/app/(admin)/admin/_lib/labels";

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const category = await getCategoryById(id);
    if (!category) notFound();

    const parentOptions = await getParentOptionsGrouped(id);

    return (
        <>
            <PageHeader
                back={{ href: "/admin/categories", label: "Category tree" }}
                title={category.name}
                description={`/${category.slug}`}
                meta={
                    <>
                        <Badge tone="neutral">
                            {GENDER_LABELS[category.gender] ?? category.gender}
                        </Badge>
                        <Badge tone="neutral">Level {category.level}</Badge>
                    </>
                }
            />

            <CategoryForm
                mode="edit"
                defaults={{
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    gender: category.gender,
                    parentId: category.parentId,
                    image: category.image,
                }}
                parentOptions={parentOptions}
            />
        </>
    );
}
