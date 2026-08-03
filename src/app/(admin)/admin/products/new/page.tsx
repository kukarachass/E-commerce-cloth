import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/rbac";
import { db } from "@/db";
import { brand } from "@/db/schema";
import { getCategoryGroups } from "@/lib/admin/queries/categories";
import ProductForm from "@/app/(admin)/admin/_components/products/ProductForm";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";

export default async function NewProductPage() {
    await requireAdmin();

    const [brands, categoryGroups] = await Promise.all([
        db
            .select({ id: brand.id, name: brand.name })
            .from(brand)
            .where(eq(brand.isActive, true))
            .orderBy(asc(brand.name)),
        getCategoryGroups(),
    ]);

    return (
        <>
            <PageHeader
                back={{ href: "/admin/products", label: "All products" }}
                title="New product"
                description="Fill in the basics, add sizes and images — you can refine the copy later."
            />

            <ProductForm
                mode="create"
                brands={brands}
                categoryGroups={categoryGroups}
            />
        </>
    );
}
