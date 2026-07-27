import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import { getCategoryGroups } from "@/lib/admin/queries/categories";
import { db } from "@/db";
import { brand } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import ProductForm from "@/app/(admin)/admin/_components/products/ProductForm";
import {getProductForEdit} from "@/lib/admin/actions/getProductForEdit";

export default async function EditProductPage({
                                                  params,
                                              }: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const [item, brands, categoryGroups] = await Promise.all([
        getProductForEdit(id),
        db.select({ id: brand.id, name: brand.name }).from(brand)
            .where(eq(brand.isActive, true)).orderBy(asc(brand.name)),
        getCategoryGroups(),
    ]);

    if (!item) notFound();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl">{item.name}</h1>
                <span className={item.isActive ? "text-green-600 text-sm" : "text-gray-400 text-sm"}>
          {item.isActive ? "Активен" : "Скрыт"}
        </span>
            </div>

            <ProductForm
                mode="edit"
                brands={brands}
                categoryGroups={categoryGroups}
                defaults={{
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    shortDescription: item.shortDescription ?? "",
                    description: item.description ?? "",
                    price: item.discountPrice,
                    // старую цену показываем, только если она реально отличается
                    oldPrice: item.discount > 0 ? item.originalPrice : "",
                    material: item.material ?? "",
                    careInstructions: item.careInstructions ?? "",
                    gender: item.gender,
                    brandId: item.brandId,
                    categoryId: item.categoryId,
                    isActive: item.isActive,
                    sizes: item.sizes.map((s) => ({
                        size: s.size,
                        sizeSystem: s.sizeSystem,
                        stockAmount: s.stockAmount,
                    })),
                    images: item.images.map((i) => ({ url: i.url, isMain: i.isMain })),
                }}
            />
        </div>
    );
}