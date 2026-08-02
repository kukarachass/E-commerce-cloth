import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Ban,
    Monitor,
    ShoppingCart,
    Receipt,
    ShieldCheck,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import getUserById from "@/lib/admin/queries/users-queries/getUserById";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card, { CardHeader, DetailRow } from "@/app/(admin)/admin/_components/ui/Card";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import { StatCard } from "@/app/(admin)/admin/_components/ui/Metric";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import UserActions from "@/app/(admin)/admin/_components/users/UsersActions";
import {
    euro,
    formatDate,
    formatDateTime,
    toNumber,
} from "@/app/(admin)/admin/_lib/format";
import {
    FULFILLMENT_LABELS,
    FULFILLMENT_TONES,
    GENDER_LABELS,
    PAYMENT_LABELS,
    PAYMENT_TONES,
    ROLE_LABELS,
} from "@/app/(admin)/admin/_lib/labels";

export default async function UserPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const user = await getUserById(id);
    if (!user) notFound();

    const paidOrders = user.orders.filter((o) => o.paymentStatus === "paid");
    const lifetimeSpend = paidOrders.reduce(
        (sum, o) => sum + toNumber(o.totalAmount),
        0,
    );
    const avgOrder = paidOrders.length ? lifetimeSpend / paidOrders.length : 0;
    const cartItems = user.cart?.items ?? [];
    const fullName = [user.name, user.lastName].filter(Boolean).join(" ");

    return (
        <>
            <PageHeader
                back={{ href: "/admin/users", label: "All customers" }}
                title={fullName || "Unnamed customer"}
                description={user.email}
                meta={
                    <>
                        <Badge tone={user.role === "admin" ? "dark" : "neutral"}>
                            {ROLE_LABELS[user.role] ?? user.role}
                        </Badge>
                        <Badge tone={user.emailVerified ? "positive" : "caution"} dot>
                            {user.emailVerified ? "Email verified" : "Email unverified"}
                        </Badge>
                        {user.banned && <Badge tone="critical">Banned</Badge>}
                        <Badge tone="neutral">
                            Joined {formatDate(user.createdAt)}
                        </Badge>
                    </>
                }
            />

            {user.banned && (
                <div className="mb-3 flex items-start gap-3 rounded-card border border-critical/25 bg-critical-soft px-4 py-3.5">
                    <Ban className="mt-0.5 h-4 w-4 shrink-0 text-critical" />
                    <div className="text-sm">
                        <p className="font-semibold text-critical">
                            Account is blocked
                        </p>
                        <p className="text-ink-soft">
                            {user.banReason ?? "No reason recorded"} ·{" "}
                            {user.banExpires
                                ? `until ${formatDate(user.banExpires)}`
                                : "permanent"}
                        </p>
                    </div>
                </div>
            )}

            <div className="mb-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Lifetime spend"
                    value={euro(lifetimeSpend)}
                    sub={`${paidOrders.length} paid orders`}
                    variant="dark"
                />
                <StatCard
                    label="Average order"
                    value={euro(avgOrder)}
                    sub="across paid orders"
                    icon={Receipt}
                />
                <StatCard
                    label="Cart right now"
                    value={euro(user.cart?.grandTotal ?? 0)}
                    sub={`${cartItems.length} lines`}
                    icon={ShoppingCart}
                />
                <StatCard
                    label="Active sessions"
                    value={user.sessions.length}
                    sub="signed-in devices"
                    icon={Monitor}
                />
            </div>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                {/* ── история ────────────────────────────────────── */}
                <div className="grid content-start gap-3">
                    <Card>
                        <CardHeader
                            title={`Orders · ${user.orders.length}`}
                            hint="Newest first"
                        />

                        {user.orders.length === 0 ? (
                            <EmptyState
                                icon={Receipt}
                                title="No orders yet"
                                description="This customer has not checked out."
                                compact
                            />
                        ) : (
                            <ul className="grid gap-2.5">
                                {user.orders.map((order) => (
                                    <li key={order.id}>
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="block rounded-card border border-line-strong p-3.5 transition-colors hover:border-ink/20 hover:bg-sunk/60"
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-[13px] font-semibold text-ink">
                                                    #{order.id.slice(0, 8)}
                                                </span>
                                                <Badge tone={PAYMENT_TONES[order.paymentStatus]} dot>
                                                    {PAYMENT_LABELS[order.paymentStatus]}
                                                </Badge>
                                                <Badge
                                                    tone={FULFILLMENT_TONES[order.fulfillmentStatus]}
                                                >
                                                    {FULFILLMENT_LABELS[order.fulfillmentStatus]}
                                                </Badge>
                                                <span className="tnum ml-auto text-sm font-semibold text-ink">
                                                    {euro(order.totalAmount)}
                                                </span>
                                            </div>

                                            <ul className="mt-2.5 grid gap-1 border-t border-line pt-2.5">
                                                {order.items.map((item) => {
                                                    const snapshot = item.productSnapshot as {
                                                        name?: string;
                                                    };
                                                    return (
                                                        <li
                                                            key={item.id}
                                                            className="flex items-center gap-2 text-xs text-ink-soft"
                                                        >
                                                            <span className="min-w-0 flex-1 truncate">
                                                                {snapshot?.name ?? "Product removed"}
                                                            </span>
                                                            <span className="shrink-0 text-ink-faint">
                                                                {item.size} · ×{item.quantity}
                                                            </span>
                                                            <span className="tnum w-16 shrink-0 text-right">
                                                                {euro(item.price)}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>

                                            <p className="mt-2 text-[11px] text-ink-faint">
                                                {formatDateTime(order.createdAt)}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card>
                        <CardHeader
                            title="Current cart"
                            hint={
                                user.cart
                                    ? `Subtotal ${euro(user.cart.totalAmount)} · due ${euro(user.cart.grandTotal)}`
                                    : undefined
                            }
                        />

                        {cartItems.length === 0 ? (
                            <EmptyState
                                icon={ShoppingCart}
                                title="Cart is empty"
                                compact
                            />
                        ) : (
                            <ul className="grid">
                                {cartItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center gap-3 border-b border-line py-2.5 first:pt-0 last:border-0 last:pb-0 text-sm"
                                    >
                                        <span className="min-w-0 flex-1 truncate text-ink">
                                            {item.product?.name ?? "—"}
                                        </span>
                                        <Badge tone="neutral">
                                            {item.productSize?.size ?? "—"}
                                        </Badge>
                                        <span className="tnum w-10 shrink-0 text-right text-xs text-ink-faint">
                                            ×{item.quantity}
                                        </span>
                                        <span className="tnum w-20 shrink-0 text-right font-medium text-ink">
                                            {euro(item.priceAtAddition)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>

                {/* ── профиль и управление ───────────────────────── */}
                <div className="grid content-start gap-3">
                    <Card>
                        <div className="flex items-center gap-3.5">
                            <Avatar
                                name={fullName}
                                email={user.email}
                                src={user.image}
                                size="lg"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-ink">
                                    {fullName || "Unnamed customer"}
                                </p>
                                <p className="truncate text-xs text-ink-faint">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-line pt-2">
                            <DetailRow label="Phone" value={user.phoneNumber ?? "—"} />
                            <DetailRow
                                label="Shops for"
                                value={
                                    user.gender
                                        ? (GENDER_LABELS[user.gender] ?? user.gender)
                                        : "—"
                                }
                            />
                            <DetailRow
                                label="Date of birth"
                                value={
                                    user.dateOfBirth ? formatDate(user.dateOfBirth) : "—"
                                }
                            />
                            <DetailRow
                                label="Stripe customer"
                                value={user.stripeCustomerId ?? "—"}
                                mono
                            />
                            <DetailRow label="User id" value={user.id} mono />
                        </div>
                    </Card>

                    <UserActions
                        userId={user.id}
                        isBanned={!!user.banned}
                        role={user.role}
                        emailVerified={user.emailVerified}
                    />

                    <Card>
                        <CardHeader
                            title={`Sessions · ${user.sessions.length}`}
                            action={
                                <ShieldCheck
                                    className="h-4 w-4 text-ink-faint"
                                    strokeWidth={1.8}
                                />
                            }
                        />

                        {user.sessions.length === 0 ? (
                            <EmptyState
                                icon={Monitor}
                                title="No active sessions"
                                compact
                            />
                        ) : (
                            <ul className="grid gap-2">
                                {user.sessions.map((s) => (
                                    <li
                                        key={s.id}
                                        className="rounded-xl bg-sunk px-3 py-2.5"
                                    >
                                        <p className="tnum text-xs font-medium text-ink">
                                            {s.ipAddress ?? "unknown ip"}
                                        </p>
                                        <p className="mt-0.5 truncate text-[11px] text-ink-faint">
                                            {s.userAgent ?? "unknown device"}
                                        </p>
                                        <p className="mt-1 text-[11px] text-ink-soft">
                                            expires {formatDateTime(s.expiresAt)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}
