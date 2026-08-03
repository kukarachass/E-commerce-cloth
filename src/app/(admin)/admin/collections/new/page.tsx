import { requireAdmin } from "@/lib/admin/rbac";
import CollectionForm from "@/app/(admin)/admin/_components/collection/CollectionForm";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";

export default async function NewCollectionPage() {
    await requireAdmin();

    return (
        <>
            <PageHeader
                back={{ href: "/admin/collections", label: "All collections" }}
                title="New collection"
                description="Create the edit first — products are added on the next step."
            />
            <CollectionForm mode="create" />
        </>
    );
}
