import { RotateCcw } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getReturnList } from "@/lib/admin/queries/returns";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card from "@/app/(admin)/admin/_components/ui/Card";
import DataTable, { type Column } from "@/app/(admin)/admin/_components/ui/DataTable";
import SegmentedTabs from "@/app/(admin)/admin/_components/ui/SegmentedTabs";
import Pagination from "@/app/(admin)/admin/_components/ui/Pagination";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import { euroFromCents, formatDate, timeAgo } from "@/app/(admin)/admin/_lib/format";
import { RETURN_STATUS_LABELS } from "@/app/(admin)/admin/_lib/labels";
import { buildUrl, first, type SearchParams } from "@/app/(admin)/admin/_lib/query";

type ReturnRow = Awaited<ReturnType<typeof getReturnList>>["rows"][number];

function parseStatus(value: string | undefined) {
    return value === "open" || value === "closed" ? value : undefined;
}

export default async function ReturnsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const status = parseStatus(first(sp.status));
    const page = Number(first(sp.page)) || 1;

    const { rows, total, totalPages } = await getReturnList({ page, status });

    const columns: Column<ReturnRow>[] = [
        {
            key: "request",
            header: "Request",
            width: "150px",
            mobile: "title",
            cell: (r) => (
                <span className="min-w-0">
                    <span className="block truncate font-mono text-[13px] font-semibold text-ink">
                        #{r.id.slice(0, 8)}
                    </span>
                    <span className="block text-xs text-ink-faint">
                        {r.itemCount} {r.itemCount === 1 ? "item" : "items"}
                    </span>
                </span>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            width: "minmax(0,1.8fr)",
            label: "Customer",
            cell: (r) => (
                <span className="flex min-w-0 items-center gap-2.5">
                    <Avatar name={r.customerName} email={r.email} size="sm" />
                    <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">
                            {r.customerName ?? "Guest"}
                        </span>
                        <span className="block truncate text-xs text-ink-faint">
                            {r.email}
                        </span>
                    </span>
                </span>
            ),
        },
        {
            key: "order",
            header: "Order",
            width: "130px",
            label: "Order",
            cell: (r) => (
                <span className="font-mono text-xs text-ink-soft">
                    #{r.orderId.slice(0, 8)}
                </span>
            ),
        },
        {
            key: "status",
            header: "Status",
            width: "120px",
            label: "Status",
            cell: (r) => (
                <Badge tone={r.status === "open" ? "caution" : "positive"} dot>
                    {RETURN_STATUS_LABELS[r.status]}
                </Badge>
            ),
        },
        {
            key: "date",
            header: "Opened",
            width: "130px",
            label: "Opened",
            cell: (r) => (
                <span className="text-xs text-ink-soft">
                    {formatDate(r.createdAt)}
                    <span className="block text-ink-faint">{timeAgo(r.createdAt)}</span>
                </span>
            ),
        },
        {
            key: "refunded",
            header: "Refunded",
            width: "120px",
            align: "right",
            label: "Refunded",
            mobile: "trailing",
            cell: (r) =>
                r.refundedAmount > 0 ? (
                    <span className="tnum font-semibold text-ink">
                        {euroFromCents(r.refundedAmount)}
                    </span>
                ) : (
                    <span className="text-xs text-ink-faint">—</span>
                ),
        },
    ];

    return (
        <>
            <PageHeader
                title="Returns"
                count={total}
                description="Review requests, take items back to stock, then refund."
            />

            <div className="mb-4">
                <SegmentedTabs
                    items={[
                        {
                            href: "/admin/returns",
                            label: "All",
                            active: !status,
                        },
                        {
                            href: "/admin/returns?status=open",
                            label: "Open",
                            active: status === "open",
                        },
                        {
                            href: "/admin/returns?status=closed",
                            label: "Closed",
                            active: status === "closed",
                        },
                    ]}
                />
            </div>

            <Card padded={false} className="p-2 sm:p-3">
                <DataTable
                    columns={columns}
                    rows={rows}
                    getKey={(r) => r.id}
                    href={(r) => `/admin/returns/${r.id}`}
                    empty={
                        <EmptyState
                            icon={RotateCcw}
                            title={
                                status === "open"
                                    ? "No open requests"
                                    : "No return requests here"
                            }
                            description="Requests appear as soon as a customer starts a return."
                        />
                    }
                />
            </Card>

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                buildHref={(p) => buildUrl("/admin/returns", { status, page: p })}
            />
        </>
    );
}
