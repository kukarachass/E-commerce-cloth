import {requireAdmin} from "@/lib/admin/rbac";
import {notFound} from "next/navigation";
import CategoryForm from "@/app/(admin)/admin/_components/category/CategoryForm";
import {getParentOptionsGrouped} from "@/lib/admin/queries/categories-operations/getParentOptionsGrouped";
import {getCategoryById} from "@/lib/admin/queries/categories-operations/getCategoryById";

interface CategoryPageProps{
    params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps){
    await requireAdmin();
    const { id } = await params;

    const category = await getCategoryById(id);
    if(!category) return notFound();

    const parentOptions = await getParentOptionsGrouped(id);

    return(
        <div>
            <h1 className="text-xl mb-6">{category.name}</h1>
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
        </div>
    )
}