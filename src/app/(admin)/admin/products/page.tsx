import { ImageIcon, PackageSearch, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getProductList } from "@/lib/admin/queries/products";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card from "@/app/(admin)/admin/_components/ui/Card";
import DataTable, {
    type Column,
    MediaCell,
} from "@/app/(admin)/admin/_components/ui/DataTable";
import FilterBar from "@/app/(admin)/admin/_components/ui/FilterBar";
import SegmentedTabs from "@/app/(admin)/admin/_components/ui/SegmentedTabs";
import Pagination from "@/app/(admin)/admin/_components/ui/Pagination";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import { LinkButton } from "@/app/(admin)/admin/_components/ui/Button";
import { euro, timeAgo } from "@/app/(admin)/admin/_lib/format";
import { GENDER_LABELS } from "@/app/(admin)/admin/_lib/labels";
import { buildUrl, first, type SearchParams } from "@/app/(admin)/admin/_lib/query";

type ProductRow = Awaited<ReturnType<typeof getProductList>>["rows"][number];

const STATUSES = ["all", "active", "inactive"] as const;
type Status = (typeof STATUSES)[number];

function parseStatus(value: string | undefined): Status {
    return STATUSES.includes(value as Status) ? (value as Status) : "all";
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const search = first(sp.search);
    const status = parseStatus(first(sp.status));
    const page = Number(first(sp.page)) || 1;

    const { rows, total, totalPages, perPage } = await getProductList({
        page,
        search,
        status,
    });

    const tabHref = (next: Status) => buildUrl("/admin/products", { search, status: next });

    const columns: Column<ProductRow>[] = [
        {
            key: "product",
            header: "Product",
            width: "minmax(0,2.4fr)",
            mobile: "title",
            cell: (p) => (
                <MediaCell
                    image={p.image}
                    fallback={<ImageIcon className="h-4 w-4 text-ink-faint" />}
                    title={p.name}
                    subtitle={`/${p.slug}`}
                />
            ),
        },
        {
            key: "brand",
            header: "Brand",
            width: "minmax(0,1fr)",
            label: "Brand",
            cell: (p) => (
                <span className="truncate text-ink-soft">{p.brandName ?? "—"}</span>
            ),
        },
        {
            key: "gender",
            header: "Audience",
            width: "110px",
            label: "Audience",
            cell: (p) => (
                <Badge tone="neutral">{GENDER_LABELS[p.gender] ?? p.gender}</Badge>
            ),
        },
        {
            key: "price",
            header: "Price",
            width: "160px",
            label: "Price",
            mobile: "trailing",
            cell: (p) => (
                <span className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 lg:justify-start">
                    <span className="tnum font-semibold text-ink">
                        {euro(p.discountPrice)}
                    </span>
                    {p.discount > 0 && (
                        <>
                            <span className="tnum text-xs text-ink-faint line-through">
                                {euro(p.originalPrice)}
                            </span>
                            <Badge tone="accent">−{p.discount}%</Badge>
                        </>
                    )}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            width: "120px",
            label: "Status",
            cell: (p) => (
                <Badge tone={p.isActive ? "positive" : "neutral"} dot>
                    {p.isActive ? "Live" : "Hidden"}
                </Badge>
            ),
        },
        {
            key: "created",
            header: "Added",
            width: "110px",
            align: "right",
            label: "Added",
            cell: (p) => (
                <span className="text-xs text-ink-faint">{timeAgo(p.createdAt)}</span>
            ),
        },
    ];

    return (
        <>
            <PageHeader
                title="Products"
                count={total}
                description="Everything customers can buy, with pricing and visibility."
                actions={
                    <LinkButton href="/admin/products/new" variant="primary">
                        <Plus className="h-4 w-4" />
                        New product
                    </LinkButton>
                }
            />

            <div className="mb-4 flex flex-wrap items-center gap-3">
                <SegmentedTabs
                    items={[
                        { href: tabHref("all"), label: "All", active: status === "all" },
                        {
                            href: tabHref("active"),
                            label: "Live",
                            active: status === "active",
                        },
                        {
                            href: tabHref("inactive"),
                            label: "Hidden",
                            active: status === "inactive",
                        },
                    ]}
                />
            </div>

            <FilterBar
                searchValue={search}
                searchPlaceholder="Search by product name"
                resetHref="/admin/products"
            >
                <input type="hidden" name="status" value={status} />
            </FilterBar>

            <Card padded={false} className="p-2 sm:p-3">
                <DataTable
                    columns={columns}
                    rows={rows}
                    getKey={(p) => p.id}
                    href={(p) => `/admin/products/${p.id}`}
                    empty={
                        <EmptyState
                            icon={PackageSearch}
                            title={search ? "No products match that search" : "No products yet"}
                            description={
                                search
                                    ? "Try a shorter query or clear the filters."
                                    : "Add the first product to start selling."
                            }
                            action={
                                <LinkButton href="/admin/products/new" variant="primary" size="sm">
                                    <Plus className="h-4 w-4" />
                                    New product
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
                perPage={perPage}
                buildHref={(p) => buildUrl("/admin/products", { search, status, page: p })}
            />
        </>
    );
}
