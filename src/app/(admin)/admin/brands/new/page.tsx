import { requireAdmin } from "@/lib/admin/rbac";
import BrandForm from "@/app/(admin)/admin/_components/brands/BrandForm";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";

export default async function NewBrandPage() {
    await requireAdmin();

    return (
        <>
            <PageHeader
                back={{ href: "/admin/brands", label: "All brands" }}
                title="New brand"
                description="Brands power filters, banners and the brand landing page."
            />
            <BrandForm mode="create" />
        </>
    );
}
