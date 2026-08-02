import { Layers, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getCollectionsList } from "@/lib/admin/queries/collections";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card from "@/app/(admin)/admin/_components/ui/Card";
import DataTable, { type Column } from "@/app/(admin)/admin/_components/ui/DataTable";
import FilterBar from "@/app/(admin)/admin/_components/ui/FilterBar";
import Pagination from "@/app/(admin)/admin/_components/ui/Pagination";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import { LinkButton } from "@/app/(admin)/admin/_components/ui/Button";
import { GENDER_LABELS } from "@/app/(admin)/admin/_lib/labels";
import { buildUrl, first, type SearchParams } from "@/app/(admin)/admin/_lib/query";

type CollectionRow = Awaited<
    ReturnType<typeof getCollectionsList>
>["rows"][number];

export default async function CollectionsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const search = first(sp.search);
    const page = Number(first(sp.page)) || 1;

    const { rows, total, totalPages } = await getCollectionsList({ page, search });

    const columns: Column<CollectionRow>[] = [
        {
            key: "collection",
            header: "Collection",
            width: "minmax(0,2.2fr)",
            mobile: "title",
            cell: (c) => (
                <span className="flex min-w-0 items-center gap-3">
                    <span className="hatch grid grid-cols-1 h-11 w-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-sunk">
                        {c.banner ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={c.banner}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Layers className="h-4 w-4 text-ink-faint" />
                        )}
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">
                            {c.title}
                        </span>
                        <span className="block truncate text-xs text-ink-faint">
                            /{c.slug}
                        </span>
                    </span>
                </span>
            ),
        },
        {
            key: "gender",
            header: "Audience",
            width: "120px",
            label: "Audience",
            cell: (c) => (
                <Badge tone="neutral">{GENDER_LABELS[c.gender] ?? c.gender}</Badge>
            ),
        },
        {
            key: "products",
            header: "Products",
            width: "120px",
            label: "Products",
            cell: (c) => (
                <span className="tnum text-ink-soft">{String(c.productCount)}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            width: "120px",
            align: "right",
            label: "Status",
            mobile: "trailing",
            cell: (c) => (
                <Badge tone={c.isActive ? "positive" : "neutral"} dot>
                    {c.isActive ? "Active" : "Hidden"}
                </Badge>
            ),
        },
    ];

    return (
        <>
            <PageHeader
                title="Collections"
                count={total}
                description="Curated edits that group products into a single story."
                actions={
                    <LinkButton href="/admin/collections/new" variant="primary">
                        <Plus className="h-4 w-4" />
                        New collection
                    </LinkButton>
                }
            />

            <FilterBar
                searchValue={search}
                searchPlaceholder="Search by title"
                resetHref="/admin/collections"
            />

            <Card padded={false} className="p-2 sm:p-3">
                <DataTable
                    columns={columns}
                    rows={rows}
                    getKey={(c) => c.id}
                    href={(c) => `/admin/collections/${c.id}`}
                    empty={
                        <EmptyState
                            icon={Layers}
                            title="No collections yet"
                            description="Build one to feature a seasonal edit on the storefront."
                            action={
                                <LinkButton
                                    href="/admin/collections/new"
                                    variant="primary"
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4" />
                                    New collection
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
                buildHref={(p) => buildUrl("/admin/collections", { search, page: p })}
            />
        </>
    );
}
