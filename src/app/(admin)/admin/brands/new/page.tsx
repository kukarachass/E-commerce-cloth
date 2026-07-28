import { requireAdmin } from "@/lib/admin/rbac";
import BrandForm from "@/app/(admin)/admin/_components/brands/BrandForm";

export default async function NewBrandPage() {
    await requireAdmin();
    return (
        <div>
            <h1 className="text-xl mb-6">Новый бренд</h1>
            <BrandForm mode="create" />
        </div>
    );
}