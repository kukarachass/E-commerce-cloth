import { notFound } from "next/navigation";
import { PackagePlus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getCollectionById } from "@/lib/admin/queries/collections";
import CollectionForm from "@/app/(admin)/admin/_components/collection/CollectionForm";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import { LinkButton } from "@/app/(admin)/admin/_components/ui/Button";
import { GENDER_LABELS } from "@/app/(admin)/admin/_lib/labels";

export default async function EditCollectionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const collection = await getCollectionById(id);
    if (!collection) notFound();

    return (
        <>
            <PageHeader
                back={{ href: "/admin/collections", label: "All collections" }}
                title={collection.title}
                description={`/${collection.slug}`}
                meta={
                    <>
                        <Badge tone={collection.isActive ? "positive" : "neutral"} dot>
                            {collection.isActive ? "Active" : "Hidden"}
                        </Badge>
                        <Badge tone="neutral">
                            {GENDER_LABELS[collection.gender] ?? collection.gender}
                        </Badge>
                    </>
                }
                actions={
                    <LinkButton
                        href={`/admin/collections/${id}/products`}
                        variant="primary"
                    >
                        <PackagePlus className="h-4 w-4" />
                        Manage products
                    </LinkButton>
                }
            />

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
        </>
    );
}
