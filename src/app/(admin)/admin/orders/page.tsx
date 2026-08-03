import { Receipt } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getOrderList } from "@/lib/admin/queries/orders";
import {
    orderFulfillmentStatusEnum,
    orderPaymentStatusEnum,
} from "@/db/schema";
import {
    parseEnumParam,
    type OrderFulfillmentStatus,
    type OrderPaymentStatus,
} from "@/types/IOrder";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card from "@/app/(admin)/admin/_components/ui/Card";
import DataTable, { type Column } from "@/app/(admin)/admin/_components/ui/DataTable";
import FilterBar from "@/app/(admin)/admin/_components/ui/FilterBar";
import SegmentedTabs from "@/app/(admin)/admin/_components/ui/SegmentedTabs";
import Pagination from "@/app/(admin)/admin/_components/ui/Pagination";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import { euro, formatDate, formatTime } from "@/app/(admin)/admin/_lib/format";
import {
    FULFILLMENT_LABELS,
    FULFILLMENT_TONES,
    PAYMENT_LABELS,
    PAYMENT_TONES,
} from "@/app/(admin)/admin/_lib/labels";
import { buildUrl, first, type SearchParams } from "@/app/(admin)/admin/_lib/query";

type OrderRow = Awaited<ReturnType<typeof getOrderList>>["rows"][number];

type OrderView = {
    label: string;
    params: {
        payment?: OrderPaymentStatus;
        fulfillment?: OrderFulfillmentStatus;
    };
};

/** Сохранённые срезы — то, что открывают по десять раз в день */
const VIEWS: OrderView[] = [
    { label: "All", params: {} },
    { label: "To pack", params: { fulfillment: "unfulfilled", payment: "paid" } },
    { label: "Unpaid", params: { payment: "pending" } },
    { label: "Shipped", params: { fulfillment: "shipped" } },
    { label: "Returned", params: { fulfillment: "returned" } },
];

export default async function OrdersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const search = first(sp.search);
    const payment = parseEnumParam(sp.payment, orderPaymentStatusEnum.enumValues);
    const fulfillment = parseEnumParam(
        sp.fulfillment,
        orderFulfillmentStatusEnum.enumValues,
    );
    const page = Number(first(sp.page)) || 1;

    const { rows, total, totalPages } = await getOrderList({
        page,
        search,
        payment,
        fulfillment,
    });

    const isActiveView = (params: OrderView["params"]) =>
        params.payment === payment && params.fulfillment === fulfillment;

    const columns: Column<OrderRow>[] = [
        {
            key: "order",
            header: "Order",
            width: "150px",
            mobile: "title",
            cell: (o) => (
                <span className="min-w-0">
                    <span className="block truncate font-mono text-[13px] font-semibold text-ink">
                        #{o.id.slice(0, 8)}
                    </span>
                    <span className="block text-xs text-ink-faint">
                        {o.itemCount} {Number(o.itemCount) === 1 ? "item" : "items"}
                    </span>
                </span>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            width: "minmax(0,1.8fr)",
            label: "Customer",
            cell: (o) => (
                <span className="flex min-w-0 items-center gap-2.5">
                    <Avatar name={o.customerName} email={o.email} size="sm" />
                    <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">
                            {o.customerName ?? "Guest"}
                        </span>
                        <span className="block truncate text-xs text-ink-faint">
                            {o.email}
                        </span>
                    </span>
                </span>
            ),
        },
        {
            key: "payment",
            header: "Payment",
            width: "150px",
            label: "Payment",
            cell: (o) => (
                <Badge tone={PAYMENT_TONES[o.paymentStatus]} dot>
                    {PAYMENT_LABELS[o.paymentStatus]}
                </Badge>
            ),
        },
        {
            key: "fulfillment",
            header: "Fulfilment",
            width: "140px",
            label: "Fulfilment",
            cell: (o) => (
                <Badge tone={FULFILLMENT_TONES[o.fulfillmentStatus]}>
                    {FULFILLMENT_LABELS[o.fulfillmentStatus]}
                </Badge>
            ),
        },
        {
            key: "date",
            header: "Placed",
            width: "130px",
            label: "Placed",
            cell: (o) => (
                <span className="text-xs text-ink-soft">
                    {formatDate(o.createdAt)}
                    <span className="block text-ink-faint">
                        {formatTime(o.createdAt)}
                    </span>
                </span>
            ),
        },
        {
            key: "total",
            header: "Total",
            width: "110px",
            align: "right",
            label: "Total",
            mobile: "trailing",
            cell: (o) => (
                <span className="tnum font-semibold text-ink">
                    {euro(o.totalAmount)}
                </span>
            ),
        },
    ];

    return (
        <>
            <PageHeader
                title="Orders"
                count={total}
                description="Every order from checkout to delivery."
            />

            <div className="mb-4">
                <SegmentedTabs
                    items={VIEWS.map((view) => ({
                        href: buildUrl("/admin/orders", { search, ...view.params }),
                        label: view.label,
                        active: isActiveView(view.params),
                    }))}
                />
            </div>

            <FilterBar
                searchValue={search}
                searchPlaceholder="Search by customer email"
                resetHref="/admin/orders"
                selects={[
                    {
                        name: "payment",
                        value: payment ?? "all",
                        options: [
                            { value: "all", label: "Payment: any" },
                            ...orderPaymentStatusEnum.enumValues.map((v) => ({
                                value: v,
                                label: PAYMENT_LABELS[v],
                            })),
                        ],
                    },
                    {
                        name: "fulfillment",
                        value: fulfillment ?? "all",
                        options: [
                            { value: "all", label: "Fulfilment: any" },
                            ...orderFulfillmentStatusEnum.enumValues.map((v) => ({
                                value: v,
                                label: FULFILLMENT_LABELS[v],
                            })),
                        ],
                    },
                ]}
            />

            <Card padded={false} className="p-2 sm:p-3">
                <DataTable
                    columns={columns}
                    rows={rows}
                    getKey={(o) => o.id}
                    href={(o) => `/admin/orders/${o.id}`}
                    empty={
                        <EmptyState
                            icon={Receipt}
                            title="No orders match these filters"
                            description="Clear the filters or pick another saved view."
                        />
                    }
                />
            </Card>

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                buildHref={(p) =>
                    buildUrl("/admin/orders", { search, payment, fulfillment, page: p })
                }
            />
        </>
    );
}
