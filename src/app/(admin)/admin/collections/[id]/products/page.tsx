import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getCollectionById } from "@/lib/admin/queries/collections";
import { getProductList } from "@/lib/admin/queries/products";
import getCollectionProductIds from "@/lib/admin/actions/collection-actions/getCollectionProducts";
import type { Gender } from "@/hooks/useGender";

import ProductPicker from "@/app/(admin)/admin/_components/collection/ProductPicker";
import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card from "@/app/(admin)/admin/_components/ui/Card";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import FilterBar from "@/app/(admin)/admin/_components/ui/FilterBar";
import Pagination from "@/app/(admin)/admin/_components/ui/Pagination";
import { LinkButton } from "@/app/(admin)/admin/_components/ui/Button";
import { GENDER_LABELS } from "@/app/(admin)/admin/_lib/labels";
import { buildUrl, first, type SearchParams } from "@/app/(admin)/admin/_lib/query";

export default async function CollectionProductsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const { id } = await params;
    const sp = await searchParams;
    const search = first(sp.search);
    const page = Number(first(sp.page)) || 1;

    const [collection, addedIds] = await Promise.all([
        getCollectionById(id),
        getCollectionProductIds(id),
    ]);

    if (!collection) notFound();

    const catalog = await getProductList({
        page,
        search,
        status: "active",
        gender: collection.gender as Gender,
    });

    const base = `/admin/collections/${id}/products`;

    return (
        <>
            <PageHeader
                back={{
                    href: `/admin/collections/${id}`,
                    label: collection.title,
                }}
                title="Curate products"
                description="Only active products matching the collection audience are listed."
                meta={
                    <>
                        <Badge tone="accent">{addedIds.length} in collection</Badge>
                        <Badge tone="neutral">
                            {GENDER_LABELS[collection.gender] ?? collection.gender}
                        </Badge>
                    </>
                }
                actions={
                    <LinkButton href="/admin/products/new" variant="outline">
                        <Plus className="h-4 w-4" />
                        New product
                    </LinkButton>
                }
            />

            <FilterBar
                searchValue={search}
                searchPlaceholder="Search the catalog"
                resetHref={base}
            />

            <Card>
                {/* key пересоздаёт выбор при смене страницы или запроса:
                    иначе он сохранит отметки от предыдущего набора товаров */}
                <ProductPicker
                    key={`${page}-${search ?? ""}`}
                    collectionId={id}
                    products={catalog.rows.map((p) => ({
                        id: p.id,
                        name: p.name,
                        image: p.image,
                        gender: p.gender,
                        brandName: p.brandName,
                        price: p.discountPrice,
                    }))}
                    addedIds={addedIds}
                />
            </Card>

            <Pagination
                page={page}
                totalPages={catalog.totalPages}
                total={catalog.total}
                perPage={catalog.perPage}
                buildHref={(p) => buildUrl(base, { search, page: p })}
            />
        </>
    );
}
