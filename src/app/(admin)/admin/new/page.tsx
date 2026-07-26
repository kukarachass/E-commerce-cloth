import { requireAdmin } from "@/lib/admin/rbac";
import { db } from "@/db";
import { brand, category } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ProductForm from "@/app/(admin)/admin/_components/products/ProductForm";

export default async function NewProductPage() {
    await requireAdmin();

    const [brands, categories] = await Promise.all([
        db.select({ id: brand.id, name: brand.name })
            .from(brand).where(eq(brand.isActive, true)).orderBy(asc(brand.name)),
        db.select({ id: category.id, name: category.name })
            .from(category).orderBy(asc(category.name)),
    ]);

    return (
        <div>
            <h1 className="text-xl mb-6">Новый товар</h1>
            <ProductForm brands={brands} categories={categories} />
        </div>
    );
}