import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import { getBrandById } from "@/lib/admin/queries/brands";
import BrandForm from "@/app/(admin)/admin/_components/brands/BrandForm";

interface EditBrandPage{
    params: Promise<{ id: string }>
}

export default async function EditBrandPage({params}: EditBrandPage) {
    await requireAdmin();
    const { id } = await params;

    const b = await getBrandById(id);
    if (!b) notFound();

    return (
        <div>
            <h1 className="text-xl mb-6">{b.name}</h1>
            <BrandForm
                mode="edit"
                defaults={{
                    id: b.id,
                    name: b.name,
                    slug: b.slug,
                    description: b.description,
                    promoDetailsText: b.promoDetailsText ?? "",
                    imageUrl: b.imageUrl,
                    tags: b.tags,
                    isActive: b.isActive,
                }}
            />
        </div>
    );
}