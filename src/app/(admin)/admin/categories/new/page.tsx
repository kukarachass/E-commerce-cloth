import { requireAdmin } from "@/lib/admin/rbac";
import { getParentOptionsGrouped } from "@/lib/admin/queries/categories-operations/getParentOptionsGrouped";
import CategoryForm from "@/app/(admin)/admin/_components/category/CategoryForm";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";

export default async function NewCategoryPage() {
    await requireAdmin();
    const parentOptions = await getParentOptionsGrouped();

    return (
        <>
            <PageHeader
                back={{ href: "/admin/categories", label: "Category tree" }}
                title="New category"
                description="Pick an audience first — parents are filtered to match it."
            />
            <CategoryForm mode="create" parentOptions={parentOptions} />
        </>
    );
}
