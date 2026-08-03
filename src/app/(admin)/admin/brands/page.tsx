import { Plus, Tags } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getBrandList } from "@/lib/admin/queries/brands";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card from "@/app/(admin)/admin/_components/ui/Card";
import DataTable, {
    type Column,
    MediaCell,
} from "@/app/(admin)/admin/_components/ui/DataTable";
import FilterBar from "@/app/(admin)/admin/_components/ui/FilterBar";
import Pagination from "@/app/(admin)/admin/_components/ui/Pagination";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import { LinkButton } from "@/app/(admin)/admin/_components/ui/Button";
import { buildUrl, first, type SearchParams } from "@/app/(admin)/admin/_lib/query";

type BrandRow = Awaited<ReturnType<typeof getBrandList>>["rows"][number];

export default async function BrandsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const search = first(sp.search);
    const page = Number(first(sp.page)) || 1;

    const { rows, total, totalPages } = await getBrandList({ page, search });

    const columns: Column<BrandRow>[] = [
        {
            key: "brand",
            header: "Brand",
            width: "minmax(0,2fr)",
            mobile: "title",
            cell: (b) => (
                <MediaCell
                    square
                    image={b.imageUrl}
                    fallback={<Tags className="h-4 w-4 text-ink-faint" />}
                    title={b.name}
                    subtitle={`/${b.slug}`}
                />
            ),
        },
        {
            key: "tags",
            header: "Tags",
            width: "minmax(0,1.6fr)",
            label: "Tags",
            cell: (b) =>
                b.tags.length ? (
                    <span className="flex flex-wrap gap-1">
                        {b.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} tone="neutral">
                                {tag}
                            </Badge>
                        ))}
                        {b.tags.length > 3 && (
                            <Badge tone="neutral">+{b.tags.length - 3}</Badge>
                        )}
                    </span>
                ) : (
                    <span className="text-xs text-ink-faint">—</span>
                ),
        },
        {
            key: "products",
            header: "Products",
            width: "120px",
            label: "Products",
            cell: (b) => (
                <span className="tnum text-ink-soft">{String(b.productCount)}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            width: "120px",
            align: "right",
            label: "Status",
            mobile: "trailing",
            cell: (b) => (
                <Badge tone={b.isActive ? "positive" : "neutral"} dot>
                    {b.isActive ? "Active" : "Hidden"}
                </Badge>
            ),
        },
    ];

    return (
        <>
            <PageHeader
                title="Brands"
                count={total}
                description="Labels behind the products, with their promo copy and tags."
                actions={
                    <LinkButton href="/admin/brands/new" variant="primary">
                        <Plus className="h-4 w-4" />
                        New brand
                    </LinkButton>
                }
            />

            <FilterBar
                searchValue={search}
                searchPlaceholder="Search by brand name"
                resetHref="/admin/brands"
            />

            <Card padded={false} className="p-2 sm:p-3">
                <DataTable
                    columns={columns}
                    rows={rows}
                    getKey={(b) => b.id}
                    href={(b) => `/admin/brands/${b.id}`}
                    empty={
                        <EmptyState
                            icon={Tags}
                            title="No brands found"
                            description="Create a brand to attach products to it."
                            action={
                                <LinkButton
                                    href="/admin/brands/new"
                                    variant="primary"
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    New brand
                                </LinkButton>
                            }
                        />
                    }
                />
            </Card>

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                buildHref={(p) => buildUrl("/admin/brands", { search, page: p })}
            />
        </>
    );
}
