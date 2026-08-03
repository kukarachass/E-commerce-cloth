import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { db } from "@/db";
import { brand } from "@/db/schema";
import { getCategoryGroups } from "@/lib/admin/queries/categories";
import { getProductForEdit } from "@/lib/admin/actions/product-actions/getProductForEdit";

import ProductForm from "@/app/(admin)/admin/_components/products/ProductForm";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import { LinkButton } from "@/app/(admin)/admin/_components/ui/Button";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const [item, brands, categoryGroups] = await Promise.all([
        getProductForEdit(id),
        db
            .select({ id: brand.id, name: brand.name })
            .from(brand)
            .where(eq(brand.isActive, true))
            .orderBy(asc(brand.name)),
        getCategoryGroups(),
    ]);

    if (!item) notFound();

    const stock = item.sizes.reduce((sum, s) => sum + s.stockAmount, 0);

    return (
        <>
            <PageHeader
                back={{ href: "/admin/products", label: "All products" }}
                title={item.name}
                description={`/${item.slug}`}
                meta={
                    <>
                        <Badge tone={item.isActive ? "positive" : "neutral"} dot>
                            {item.isActive ? "Live" : "Hidden"}
                        </Badge>
                        <Badge tone={stock > 0 ? "neutral" : "caution"}>
                            {stock} in stock
                        </Badge>
                        {item.discount > 0 && (
                            <Badge tone="accent">−{item.discount}%</Badge>
                        )}
                    </>
                }
                actions={
                    <LinkButton
                        href={`/product/${item.slug}`}
                        variant="outline"
                        target="_blank"
                    >
                        <ExternalLink className="h-4 w-4" />
                        View in store
                    </LinkButton>
                }
            />

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
                    images: item.images.map((i) => ({
                        url: i.url,
                        isMain: i.isMain,
                    })),
                }}
            />
        </>
    );
}
