import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageIcon, Lock, MessageSquare, Receipt } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getReturnDetail } from "@/lib/admin/queries/returns";
import { refundableCents } from "@/lib/admin/returns/rules";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card, { CardHeader, DetailRow } from "@/app/(admin)/admin/_components/ui/Card";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import { MiniStat } from "@/app/(admin)/admin/_components/ui/Metric";
import {
    ItemDecision,
    RefundButton,
} from "@/app/(admin)/admin/_components/returns/ReturnActions";
import {
    euro,
    euroFromCents,
    formatDateTime,
    toNumber,
} from "@/app/(admin)/admin/_lib/format";
import {
    RETURN_ITEM_LABELS,
    RETURN_ITEM_TONES,
    RETURN_REASON_LABELS,
    RETURN_STATUS_LABELS,
} from "@/app/(admin)/admin/_lib/labels";

type Snapshot = { name?: string; image?: string };

export default async function ReturnDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const request = await getReturnDetail(id);
    if (!request) notFound();

    const approved = request.items.filter((i) => i.status === "approved");
    const notRestocked = approved.filter((i) => !i.restocked);
    const pendingReview = request.items.filter((i) => i.status === "requested");

    const amountCents = refundableCents(
        approved.map((i) => ({
            status: i.status,
            price: i.price,
            quantity: i.quantity,
        })),
    );

    // Причина блокировки считается теми же правилами, что применит экшен
    const blockedReason = request.stripeRefundId
        ? `Already refunded: ${euroFromCents(request.refundedAmount)}`
        : approved.length === 0
          ? "Approve at least one item first"
          : notRestocked.length > 0
            ? `Take ${notRestocked.length} item${notRestocked.length === 1 ? "" : "s"} back to stock first`
            : undefined;

    const requestedValue = request.items.reduce(
        (sum, i) => sum + toNumber(i.price) * i.quantity,
        0,
    );

    return (
        <>
            <PageHeader
                back={{ href: "/admin/returns", label: "All returns" }}
                title={<span className="font-mono">#{request.id.slice(0, 8)}</span>}
                description={`Opened ${formatDateTime(request.createdAt)}`}
                meta={
                    <>
                        <Badge
                            tone={request.status === "open" ? "caution" : "positive"}
                            dot
                        >
                            {RETURN_STATUS_LABELS[request.status]}
                        </Badge>
                        <Badge tone="neutral">
                            {request.items.length} item
                            {request.items.length === 1 ? "" : "s"}
                        </Badge>
                        {pendingReview.length > 0 && (
                            <Badge tone="accent">
                                {pendingReview.length} awaiting decision
                            </Badge>
                        )}
                    </>
                }
                actions={
                    <Link
                        href={`/admin/orders/${request.orderId}`}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-card px-4 text-sm font-medium text-ink transition-colors hover:border-ink/25"
                    >
                        <Receipt className="h-4 w-4" strokeWidth={1.8} />
                        Order #{request.orderId.slice(0, 8)}
                    </Link>
                }
            />

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                {/* ── позиции ────────────────────────────────────── */}
                <div className="grid grid-cols-1 content-start gap-3">
                    <Card>
                        <CardHeader
                            title="Requested items"
                            hint="Approve, then take the item back to stock, then refund"
                        />

                        <ul className="grid grid-cols-1">
                            {request.items.map((item) => {
                                const snap = (item.orderItem?.productSnapshot ??
                                    {}) as Snapshot;

                                return (
                                    <li
                                        key={item.id}
                                        className="grid grid-cols-1 gap-3 border-b border-line py-4 first:pt-0 last:border-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start"
                                    >
                                        <span className="hatch grid grid-cols-1 h-16 w-13 shrink-0 place-items-center overflow-hidden rounded-lg bg-sunk">
                                            {snap.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={snap.image}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="h-4 w-4 text-ink-faint" />
                                            )}
                                        </span>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-ink">
                                                {snap.name ?? "Product removed"}
                                            </p>
                                            <p className="tnum mt-1 text-xs text-ink-faint">
                                                Size {item.orderItem?.size} · {item.quantity} pc ·{" "}
                                                {euro(toNumber(item.price) * item.quantity)}
                                            </p>
                                            <p className="mt-2 flex flex-wrap items-center gap-1.5">
                                                <Badge tone={RETURN_ITEM_TONES[item.status]} dot>
                                                    {RETURN_ITEM_LABELS[item.status]}
                                                </Badge>
                                                <Badge tone="neutral">
                                                    {RETURN_REASON_LABELS[item.reason] ??
                                                        item.reason}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div className="sm:pt-1">
                                            <ItemDecision
                                                itemId={item.id}
                                                status={item.status}
                                                restocked={item.restocked}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </Card>

                    {(request.customerNote || request.adminNote) && (
                        <Card>
                            <CardHeader title="Notes" />
                            <div className="grid grid-cols-1 gap-3">
                                {request.customerNote && (
                                    <div className="rounded-field bg-sunk px-3.5 py-3">
                                        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] text-ink-faint uppercase">
                                            <MessageSquare className="h-3 w-3" />
                                            From customer
                                        </p>
                                        <p className="text-sm text-ink">
                                            {request.customerNote}
                                        </p>
                                    </div>
                                )}
                                {request.adminNote && (
                                    <div className="rounded-field border border-line-strong px-3.5 py-3">
                                        <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] text-ink-faint uppercase">
                                            <Lock className="h-3 w-3" />
                                            Internal note
                                        </p>
                                        <p className="text-sm text-ink">{request.adminNote}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* ── деньги и клиент ────────────────────────────── */}
                <div className="grid grid-cols-1 content-start gap-3">
                    <Card variant={blockedReason ? "plain" : "aurora"}>
                        <CardHeader
                            title="Refund"
                            hint="Money goes back through the original Stripe payment"
                        />

                        <div className="mb-4 grid grid-cols-2 gap-2">
                            <MiniStat
                                label="Refundable"
                                value={euroFromCents(amountCents)}
                                tone="accent"
                            />
                            <MiniStat
                                label="Refunded"
                                value={euroFromCents(request.refundedAmount)}
                            />
                        </div>

                        <RefundButton
                            requestId={request.id}
                            amountCents={amountCents}
                            blockedReason={blockedReason}
                        />

                        {request.stripeRefundId && (
                            <p className="mt-3 truncate font-mono text-[11px] text-ink-faint">
                                {request.stripeRefundId}
                            </p>
                        )}
                    </Card>

                    <Card>
                        <CardHeader title="Customer" />
                        <div className="flex items-center gap-3">
                            <Avatar
                                name={request.user?.name}
                                email={request.user?.email ?? request.order?.email}
                                size="lg"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-ink">
                                    {request.user?.name ?? "Guest"}
                                </p>
                                <p className="truncate text-xs text-ink-faint">
                                    {request.user?.email ?? request.order?.email}
                                </p>
                            </div>
                        </div>

                        {request.user?.id && (
                            <Link
                                href={`/admin/users/${request.user.id}`}
                                className="mt-3 inline-block text-xs font-medium text-accent hover:underline"
                            >
                                Open customer profile
                            </Link>
                        )}
                    </Card>

                    <Card variant="sunk">
                        <CardHeader title="Reference" />
                        <DetailRow
                            label="Order total"
                            value={euro(request.order?.totalAmount)}
                        />
                        <DetailRow
                            label="Requested value"
                            value={euro(requestedValue)}
                        />
                        <DetailRow label="Request id" value={request.id} mono />
                        <DetailRow
                            label="Updated"
                            value={formatDateTime(request.updatedAt)}
                        />
                    </Card>
                </div>
            </div>
        </>
    );
}
