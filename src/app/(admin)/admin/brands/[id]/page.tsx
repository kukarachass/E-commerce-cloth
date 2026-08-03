import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import { getBrandById } from "@/lib/admin/queries/brands";
import BrandForm from "@/app/(admin)/admin/_components/brands/BrandForm";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import { LinkButton } from "@/app/(admin)/admin/_components/ui/Button";

export default async function EditBrandPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const brand = await getBrandById(id);
    if (!brand) notFound();

    return (
        <>
            <PageHeader
                back={{ href: "/admin/brands", label: "All brands" }}
                title={brand.name}
                description={`/${brand.slug}`}
                meta={
                    <>
                        <Badge tone={brand.isActive ? "positive" : "neutral"} dot>
                            {brand.isActive ? "Active" : "Hidden"}
                        </Badge>
                        {brand.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} tone="neutral">
                                {tag}
                            </Badge>
                        ))}
                    </>
                }
                actions={
                    <LinkButton
                        href={`/admin/products?search=${encodeURIComponent(brand.name)}`}
                        variant="outline"
                    >
                        Products of this brand
                    </LinkButton>
                }
            />

            <BrandForm
                mode="edit"
                defaults={{
                    id: brand.id,
                    name: brand.name,
                    slug: brand.slug,
                    description: brand.description,
                    promoDetailsText: brand.promoDetailsText ?? "",
                    imageUrl: brand.imageUrl,
                    tags: brand.tags,
                    isActive: brand.isActive,
                }}
            />
        </>
    );
}
