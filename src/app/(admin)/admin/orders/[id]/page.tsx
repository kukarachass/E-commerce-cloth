import Link from "next/link";
import { notFound } from "next/navigation";
import {
    CreditCard,
    ImageIcon,
    MapPin,
    MessageSquare,
    RotateCcw,
    Truck,
    User,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getOrderDetail } from "@/lib/admin/queries/orders";
import { availableTransitions } from "@/lib/admin/orders/transitions";
import type { AddressSnapshot } from "@/types/IOrder";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card, { CardHeader, DetailRow } from "@/app/(admin)/admin/_components/ui/Card";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import { MiniStat } from "@/app/(admin)/admin/_components/ui/Metric";
import OrderStatusActions from "@/app/(admin)/admin/_components/orders/OrderStatusActions";
import OrderTimeline from "@/app/(admin)/admin/_components/orders/OrderTimeline";
import {
    euro,
    euroFromCents,
    formatDateTime,
    toNumber,
} from "@/app/(admin)/admin/_lib/format";
import {
    FULFILLMENT_LABELS,
    FULFILLMENT_TONES,
    PAYMENT_LABELS,
    PAYMENT_TONES,
    RETURN_STATUS_LABELS,
} from "@/app/(admin)/admin/_lib/labels";

type Snapshot = { name?: string; image?: string; slug?: string };

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const order = await getOrderDetail(id);
    if (!order) notFound();

    const address = (order.addressSnapshot ?? {}) as Partial<AddressSnapshot>;
    const actions = availableTransitions(
        order.fulfillmentStatus,
        order.paymentStatus,
    );
    const lastPayment = order.payments[0];

    const itemsTotal = order.items.reduce(
        (sum, item) => sum + toNumber(item.price) * item.quantity,
        0,
    );
    const unitCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <PageHeader
                back={{ href: "/admin/orders", label: "All orders" }}
                title={
                    <span className="font-mono">#{order.id.slice(0, 8)}</span>
                }
                description={`Placed ${formatDateTime(order.createdAt)}`}
                meta={
                    <>
                        <Badge tone={PAYMENT_TONES[order.paymentStatus]} dot>
                            {PAYMENT_LABELS[order.paymentStatus]}
                        </Badge>
                        <Badge tone={FULFILLMENT_TONES[order.fulfillmentStatus]}>
                            {FULFILLMENT_LABELS[order.fulfillmentStatus]}
                        </Badge>
                        <Badge tone="neutral">
                            {unitCount} {unitCount === 1 ? "unit" : "units"}
                        </Badge>
                    </>
                }
            />

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                {/* ── основная колонка ───────────────────────────── */}
                <div className="grid grid-cols-1 content-start gap-3">
                    <Card>
                        <CardHeader
                            title="Fulfilment"
                            hint="Stock moves automatically on cancel and return"
                        />
                        <div className="px-1 pb-1">
                            <OrderTimeline status={order.fulfillmentStatus} />
                        </div>

                        <div className="mt-5 border-t border-line pt-4">
                            <OrderStatusActions orderId={order.id} actions={actions} />
                            {order.paymentStatus !== "paid" && actions.length === 0 && (
                                <p className="mt-2 text-xs text-ink-faint">
                                    Packing and shipping unlock once the order is paid.
                                </p>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <CardHeader
                            title={`Items · ${order.items.length}`}
                            hint="Prices are snapshots taken at checkout"
                        />

                        <ul className="grid grid-cols-1">
                            {order.items.map((item) => {
                                const snap = (item.productSnapshot ?? {}) as Snapshot;
                                return (
                                    <li
                                        key={item.id}
                                        className="flex items-center gap-3.5 border-b border-line py-3 first:pt-0 last:border-0 last:pb-0"
                                    >
                                        <span className="hatch grid grid-cols-1 h-14 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-sunk">
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

                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-ink">
                                                {snap.name ?? "Product removed"}
                                            </span>
                                            <span className="mt-1 flex flex-wrap items-center gap-1.5">
                                                <Badge tone="neutral">Size {item.size}</Badge>
                                                <span className="tnum text-xs text-ink-faint">
                                                    {euro(item.price)} × {item.quantity}
                                                </span>
                                            </span>
                                        </span>

                                        <span className="tnum shrink-0 text-sm font-semibold text-ink">
                                            {euro(toNumber(item.price) * item.quantity)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="mt-4 rounded-card bg-sunk px-4 py-3">
                            <DetailRow label="Items" value={euro(itemsTotal)} />
                            <DetailRow
                                label={`Delivery · ${order.deliveryType}`}
                                value={euro(order.deliveryFee)}
                            />
                            <div className="mt-2 border-t border-line-strong pt-2">
                                <DetailRow
                                    label="Total charged"
                                    value={euro(order.totalAmount)}
                                    strong
                                />
                            </div>
                        </div>
                    </Card>

                    {lastPayment && (
                        <Card>
                            <CardHeader
                                title="Payment"
                                hint={`${order.payments.length} attempt${order.payments.length === 1 ? "" : "s"} recorded`}
                                action={
                                    <Badge tone={PAYMENT_TONES[order.paymentStatus]}>
                                        {PAYMENT_LABELS[order.paymentStatus]}
                                    </Badge>
                                }
                            />

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <MiniStat
                                    label="Method"
                                    value={lastPayment.paymentMethod ?? "—"}
                                />
                                <MiniStat
                                    label="Captured"
                                    value={euroFromCents(lastPayment.amount)}
                                />
                                <MiniStat
                                    label="Refunded"
                                    value={euroFromCents(lastPayment.refundedAmount)}
                                    tone={
                                        lastPayment.refundedAmount > 0 ? "accent" : undefined
                                    }
                                />
                            </div>

                            {lastPayment.stripePaymentIntentId && (
                                <div className="mt-3">
                                    <DetailRow
                                        label="Stripe intent"
                                        value={lastPayment.stripePaymentIntentId}
                                        mono
                                    />
                                </div>
                            )}

                            {lastPayment.failureReason && (
                                <p className="mt-3 flex items-start gap-2 rounded-field bg-critical-soft px-3 py-2.5 text-xs text-critical">
                                    <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    {lastPayment.failureReason}
                                </p>
                            )}
                        </Card>
                    )}
                </div>

                {/* ── боковая колонка ────────────────────────────── */}
                <div className="grid grid-cols-1 content-start gap-3">
                    <Card>
                        <CardHeader title="Customer" />
                        <div className="flex items-center gap-3">
                            <Avatar
                                name={order.user?.name}
                                email={order.email}
                                size="lg"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-ink">
                                    {order.user?.name ?? "Guest checkout"}
                                </p>
                                <p className="truncate text-xs text-ink-faint">
                                    {order.email}
                                </p>
                            </div>
                        </div>

                        {order.user?.id && (
                            <Link
                                href={`/admin/users/${order.user.id}`}
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                            >
                                <User className="h-3.5 w-3.5" />
                                Open customer profile
                            </Link>
                        )}
                    </Card>

                    <Card>
                        <CardHeader
                            title="Shipping address"
                            action={
                                <MapPin className="h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                            }
                        />
                        <address className="text-sm leading-relaxed text-ink not-italic">
                            {address.street} {address.houseNumber}
                            {address.houseAddition ? `-${address.houseAddition}` : ""}
                            <br />
                            <span className="tnum">{address.postcode}</span> {address.city}
                            <br />
                            <span className="text-ink-soft">{address.country}</span>
                        </address>

                        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-ink-soft">
                            <Truck className="h-3.5 w-3.5" strokeWidth={1.8} />
                            {order.deliveryType} delivery · {euro(order.deliveryFee)}
                        </div>
                    </Card>

                    {order.comment && (
                        <Card>
                            <CardHeader
                                title="Customer note"
                                action={
                                    <MessageSquare
                                        className="h-4 w-4 text-ink-faint"
                                        strokeWidth={1.8}
                                    />
                                }
                            />
                            <p className="text-sm leading-relaxed text-ink-soft">
                                {order.comment}
                            </p>
                        </Card>
                    )}

                    {order.returns.length > 0 && (
                        <Card>
                            <CardHeader
                                title={`Returns · ${order.returns.length}`}
                                action={
                                    <RotateCcw
                                        className="h-4 w-4 text-ink-faint"
                                        strokeWidth={1.8}
                                    />
                                }
                            />
                            <ul className="grid grid-cols-1 gap-2">
                                {order.returns.map((r) => (
                                    <li key={r.id}>
                                        <Link
                                            href={`/admin/returns/${r.id}`}
                                            className="flex items-center gap-3 rounded-xl bg-sunk px-3 py-2.5 transition-colors hover:bg-line-strong"
                                        >
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate font-mono text-xs font-semibold text-ink">
                                                    #{r.id.slice(0, 8)}
                                                </span>
                                                <span className="block text-[11px] text-ink-faint">
                                                    {r.items.length} item
                                                    {r.items.length === 1 ? "" : "s"}
                                                </span>
                                            </span>
                                            <Badge
                                                tone={r.status === "open" ? "caution" : "neutral"}
                                            >
                                                {RETURN_STATUS_LABELS[r.status]}
                                            </Badge>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    <Card variant="sunk">
                        <CardHeader title="Reference" />
                        <DetailRow label="Order id" value={order.id} mono />
                        <DetailRow
                            label="Created"
                            value={formatDateTime(order.createdAt)}
                        />
                        <DetailRow
                            label="Updated"
                            value={formatDateTime(order.updatedAt)}
                        />
                    </Card>
                </div>
            </div>
        </>
    );
}
