import { requireAdmin } from "@/lib/admin/rbac";
import CategoryForm from "@/app/(admin)/admin/_components/category/CategoryForm";
import {getParentOptionsGrouped} from "@/lib/admin/queries/categories-operations/getParentOptionsGrouped";

export default async function NewCategoryPage() {
    await requireAdmin();
    const parentOptions = await getParentOptionsGrouped();

    return (
        <div>
            <h1 className="text-xl mb-6">Новая категория</h1>
            <CategoryForm mode="create" parentOptions={parentOptions} />
        </div>
    );
}