import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import { getCollectionById } from "@/lib/admin/queries/collections";
import CollectionForm from "@/app/(admin)/admin/_components/collection/CollectionForm";

interface EditCollectionPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({
                                                     params,
                                                 }: EditCollectionPageProps) {
    await requireAdmin();
    const { id } = await params;

    const collection = await getCollectionById(id);
    if (!collection) notFound();

    return (
        <div>
            <h1 className="text-xl mb-6">{collection.title}</h1>
            <CollectionForm
                mode="edit"
                defaults={{
                    id: collection.id,
                    title: collection.title,
                    slug: collection.slug,
                    description: collection.description ?? "",
                    banner: collection.banner ?? "",
                    gender: collection.gender,
                    isActive: collection.isActive,
                }}
            />
        </div>
    );
}