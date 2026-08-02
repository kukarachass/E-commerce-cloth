import Link from "next/link";
import {
    ArrowUpRight,
    BadgeCheck,
    CalendarRange,
    CheckCircle2,
    PackageX,
    RotateCcw,
    Sparkles,
    Timer,
    TrendingUp,
    Wallet,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import { getDashboardStats } from "@/lib/admin/queries/admin-queries/getDashboardStats";
import { getRevenueByDay } from "@/lib/admin/queries/admin-queries/getRevenueByDay";
import { getOrdersToFulfill } from "@/lib/admin/queries/admin-queries/getOrdersToFulfill";
import { getLowStock } from "@/lib/admin/queries/admin-queries/getLowStock";
import { getTopProducts } from "@/lib/admin/queries/admin-queries/getTopProducts";
import { getOrderMix } from "@/lib/admin/queries/admin-queries/getOrderMix";
import { getRecentActivity } from "@/lib/admin/queries/admin-queries/getRecentActivity";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card, { CardHeader } from "@/app/(admin)/admin/_components/ui/Card";
import Badge, { TrendPill } from "@/app/(admin)/admin/_components/ui/Badge";
import { MiniStat, Money, ShareBar } from "@/app/(admin)/admin/_components/ui/Metric";
import ListRow from "@/app/(admin)/admin/_components/ui/ListRow";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import AlertTile from "@/app/(admin)/admin/_components/dashboard/AlertTile";
import TrendChart from "@/app/(admin)/admin/_components/charts/TrendChart";
import Donut, { DonutLegend } from "@/app/(admin)/admin/_components/charts/Donut";
import {
    count as fmtCount,
    euro,
    euroShort,
    formatDayShort,
    timeAgo,
} from "@/app/(admin)/admin/_lib/format";
import {
    AUDIT_ACTION_TONES,
    FULFILLMENT_LABELS,
} from "@/app/(admin)/admin/_lib/labels";
import type { OrderFulfillmentStatus } from "@/types/IOrder";

const MIX_COLORS: Record<OrderFulfillmentStatus, string> = {
    unfulfilled: "#e4265c",
    processing: "#3352c9",
    shipped: "#16130f",
    delivered: "#1f8a5c",
    cancelled: "#c9c3bd",
    returned: "#b26a00",
};

export default async function DashboardPage() {
    await requireAdmin();

    const [stats, byDay, toFulfill, lowStock, topProducts, mix, activity] =
        await Promise.all([
            getDashboardStats(),
            getRevenueByDay(14),
            getOrdersToFulfill(),
            getLowStock(),
            getTopProducts(),
            getOrderMix(30),
            getRecentActivity(7),
        ]);

    const previousRevenue =
        stats.revenueTrend === null
            ? null
            : stats.month.revenue / (1 + stats.revenueTrend / 100);

    const avgOrder =
        stats.month.orders > 0 ? stats.month.revenue / stats.month.orders : 0;

    const chartData = byDay.map((d) => ({
        label: formatDayShort(new Date(d.day)),
        value: d.revenue,
    }));

    const bestDay = byDay.reduce(
        (best, d) => (d.revenue > best.revenue ? d : best),
        byDay[0] ?? { day: "", revenue: 0 },
    );

    const mixSlices = mix
        .filter((m) => m.orders > 0)
        .sort((a, b) => b.orders - a.orders)
        .map((m) => ({
            label: FULFILLMENT_LABELS[m.status],
            value: m.orders,
            color: MIX_COLORS[m.status],
        }));

    const mixTotal = mixSlices.reduce((sum, s) => sum + s.value, 0);
    const topSold = Math.max(...topProducts.map((p) => p.sold), 1);
    const allClear =
        stats.toFulfill === 0 &&
        stats.openReturns === 0 &&
        lowStock.totalLowStock === 0;

    return (
        <>
            <PageHeader
                title="Dashboard"
                description="Everything that needs a decision today, on one screen."
                actions={
                    <>
                        <span className="inline-flex h-10 items-center gap-2 rounded-full bg-sunk px-4 text-sm font-medium text-ink-soft">
                            <CalendarRange className="h-4 w-4" strokeWidth={1.8} />
                            Last 30 days
                        </span>
                        <Link
                            href="/admin/orders"
                            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink-panel px-4 text-sm font-medium text-white transition-colors hover:bg-ink"
                        >
                            Open orders
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </>
                }
            />

            <div className="stagger grid grid-cols-1 gap-3">
                {/* ── выручка ─────────────────────────────────────── */}
                <Card variant="aurora" className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                                <Wallet className="h-4 w-4" strokeWidth={1.8} />
                                Revenue · paid orders
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <Money
                                    value={stats.month.revenue}
                                    className="animate-figure text-[40px] leading-none font-semibold tracking-[-0.03em] text-ink sm:text-[52px]"
                                />
                                <TrendPill value={stats.revenueTrend} />
                            </div>

                            <p className="mt-3 text-sm text-ink-soft">
                                {previousRevenue !== null
                                    ? `vs ${euro(previousRevenue)} in the previous 30 days`
                                    : "No comparable period yet — this is the baseline"}
                            </p>

                            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                <MiniStat
                                    label="Today"
                                    value={euroShort(stats.today.revenue)}
                                />
                                <MiniStat
                                    label="7 days"
                                    value={euroShort(stats.week.revenue)}
                                />
                                <MiniStat
                                    label="Orders · 30d"
                                    value={fmtCount(stats.month.orders)}
                                />
                                <MiniStat
                                    label="Avg. order"
                                    value={euroShort(avgOrder)}
                                    tone="accent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:w-[320px]">
                            <div className="rounded-card bg-ink-panel p-4 text-white shadow-float">
                                <div className="flex items-center justify-between text-xs text-white/55">
                                    Best day · 14d
                                    <Sparkles className="h-3.5 w-3.5" />
                                </div>
                                <div className="tnum mt-3 text-2xl leading-none font-semibold">
                                    {euroShort(bestDay.revenue)}
                                </div>
                                <div className="mt-1.5 text-xs text-white/55">
                                    {bestDay.day
                                        ? formatDayShort(new Date(bestDay.day))
                                        : "—"}
                                </div>
                            </div>

                            <div className="rounded-card bg-card p-4 shadow-card ring-2 ring-accent">
                                <div className="flex items-center justify-between text-xs text-ink-faint">
                                    New customers
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                </div>
                                <div className="tnum mt-3 text-2xl leading-none font-semibold text-ink">
                                    {fmtCount(stats.newCustomers)}
                                </div>
                                <div className="mt-1.5 text-xs text-ink-faint">
                                    signed up in 30 days
                                </div>
                            </div>

                            <div className="rounded-card bg-card p-4 shadow-card sm:col-span-2">
                                <div className="flex items-center justify-between text-xs text-ink-faint">
                                    Awaiting payment
                                    <Timer className="h-3.5 w-3.5" />
                                </div>
                                <div className="mt-2.5 flex items-end justify-between gap-3">
                                    <span className="tnum text-2xl leading-none font-semibold text-ink">
                                        {fmtCount(stats.pendingPayment)}
                                    </span>
                                    <Link
                                        href="/admin/orders?payment=pending"
                                        className="text-xs font-medium text-accent hover:underline"
                                    >
                                        Review
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ── требует внимания ────────────────────────────── */}
                {allClear ? (
                    <Card className="flex items-center gap-3.5">
                        <span className="grid grid-cols-1 h-11 w-11 shrink-0 place-items-center rounded-full bg-positive-soft text-positive">
                            <CheckCircle2 className="h-5 w-5" strokeWidth={1.9} />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-ink">
                                Nothing needs attention
                            </p>
                            <p className="text-xs text-ink-faint">
                                Queue is empty, returns are closed, stock levels are fine.
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <AlertTile
                            icon={Timer}
                            tone="accent"
                            value={stats.toFulfill}
                            label="to pack"
                            hint="Paid orders waiting in the queue"
                            href="/admin/orders?fulfillment=unfulfilled&payment=paid"
                        />
                        <AlertTile
                            icon={RotateCcw}
                            tone="caution"
                            value={stats.openReturns}
                            label="open returns"
                            hint="Requests awaiting a decision"
                            href="/admin/returns?status=open"
                        />
                        <AlertTile
                            icon={PackageX}
                            tone="info"
                            value={lowStock.totalLowStock}
                            label="sizes low"
                            hint="Active products almost out of stock"
                            href="/admin/products?status=active"
                        />
                    </div>
                )}

                {/* ── график + воронка ────────────────────────────── */}
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                    <Card>
                        <CardHeader
                            title="Revenue, last 14 days"
                            hint="Dashed line marks the period average"
                            action={
                                <Badge tone="accent" dot>
                                    daily
                                </Badge>
                            }
                        />
                        <TrendChart data={chartData} className="mt-2" />
                    </Card>

                    <Card>
                        <CardHeader
                            title="Fulfilment mix"
                            hint="All orders created in the last 30 days"
                        />

                        {mixTotal === 0 ? (
                            <EmptyState
                                icon={TrendingUp}
                                title="No orders yet"
                                description="The mix appears as soon as the first order lands."
                                compact
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-5 sm:flex-row">
                                <Donut
                                    slices={mixSlices}
                                    center={
                                        <div>
                                            <div className="tnum text-xl leading-none font-semibold text-ink">
                                                {mixTotal}
                                            </div>
                                            <div className="text-[10px] tracking-wide text-ink-faint uppercase">
                                                orders
                                            </div>
                                        </div>
                                    }
                                />
                                <DonutLegend slices={mixSlices} total={mixTotal} />
                            </div>
                        )}
                    </Card>
                </div>

                {/* ── очереди ─────────────────────────────────────── */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <Card>
                        <CardHeader
                            title="Packing queue"
                            hint="Oldest paid orders first"
                            action={
                                <Link
                                    href="/admin/orders?fulfillment=unfulfilled&payment=paid"
                                    className="text-xs font-medium text-accent hover:underline"
                                >
                                    View all
                                </Link>
                            }
                        />

                        {toFulfill.length === 0 ? (
                            <EmptyState
                                icon={CheckCircle2}
                                title="Queue is clear"
                                description="Every paid order has been packed."
                                compact
                            />
                        ) : (
                            <ul className="stagger-tight -mx-2.5 grid grid-cols-1 [&>li]:min-w-0">
                                {toFulfill.map((o) => (
                                    <li key={o.id}>
                                        <ListRow
                                            href={`/admin/orders/${o.id}`}
                                            leading={
                                                <Avatar
                                                    name={o.customerName}
                                                    email={o.email}
                                                    size="sm"
                                                />
                                            }
                                            title={o.customerName ?? o.email}
                                            subtitle={`#${o.id.slice(0, 8)} · ${timeAgo(o.createdAt)}`}
                                            value={euro(o.totalAmount)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card>
                        <CardHeader
                            title="Running out of stock"
                            hint={`${lowStock.totalLowStock} sizes at or below 1 item`}
                            action={
                                <Link
                                    href="/admin/products"
                                    className="text-xs font-medium text-accent hover:underline"
                                >
                                    Catalog
                                </Link>
                            }
                        />

                        {lowStock.rows.length === 0 ? (
                            <EmptyState
                                icon={CheckCircle2}
                                title="Stock levels are healthy"
                                description="No active size is below the threshold."
                                compact
                            />
                        ) : (
                            <ul className="stagger-tight -mx-2.5 grid grid-cols-1 [&>li]:min-w-0">
                                {lowStock.rows.map((s, i) => (
                                    <li key={`${s.productId}-${i}`}>
                                        <ListRow
                                            href={`/admin/products/${s.productId}`}
                                            leading={
                                                <span className="tnum inline-flex h-8 max-w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-sunk px-2 text-[11px] font-semibold text-ink-soft">
                                                    {s.size}
                                                </span>
                                            }
                                            title={s.productName}
                                            subtitle={s.sizeSystem}
                                            value={
                                                <Badge
                                                    tone={
                                                        s.stock === 0 ? "critical" : "caution"
                                                    }
                                                >
                                                    {s.stock === 0
                                                        ? "out of stock"
                                                        : `${s.stock} left`}
                                                </Badge>
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>

                {/* ── топ товаров + лента ─────────────────────────── */}
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                    <Card>
                        <CardHeader
                            title="Best sellers"
                            hint="Units sold in paid orders, last 30 days"
                        />

                        {topProducts.length === 0 ? (
                            <EmptyState
                                icon={TrendingUp}
                                title="No sales in this period"
                                description="Top products show up after the first paid order."
                                compact
                            />
                        ) : (
                            <ul className="stagger-tight -mx-2.5 grid grid-cols-1 [&>li]:min-w-0">
                                {topProducts.map((p, i) => (
                                    <li key={p.productId}>
                                        <ListRow
                                            href={`/admin/products/${p.productId}`}
                                            leading={
                                                <span className="tnum grid grid-cols-1 h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-panel text-[11px] font-semibold text-white">
                                                    {i + 1}
                                                </span>
                                            }
                                            title={p.name}
                                            subtitle={`${p.sold} sold`}
                                            value={euro(p.revenue)}
                                            footer={
                                                <ShareBar
                                                    value={p.sold}
                                                    max={topSold}
                                                    tone={i === 0 ? "accent" : "ink"}
                                                />
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card>
                        <CardHeader
                            title="Recent activity"
                            action={
                                <Link
                                    href="/admin/audit"
                                    className="text-xs font-medium text-accent hover:underline"
                                >
                                    Full log
                                </Link>
                            }
                        />

                        {activity.length === 0 ? (
                            <EmptyState
                                icon={Sparkles}
                                title="No activity recorded"
                                compact
                            />
                        ) : (
                            <ol className="stagger-tight relative grid grid-cols-1 gap-4 pl-5">
                                <span className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
                                {activity.map((row) => (
                                    <li key={row.id} className="relative">
                                        <span className="absolute top-1.5 -left-5 h-[7px] w-[7px] rounded-full bg-line-strong ring-4 ring-panel" />
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge
                                                tone={
                                                    AUDIT_ACTION_TONES[row.action] ?? "neutral"
                                                }
                                            >
                                                {row.action}
                                            </Badge>
                                            <span className="text-sm text-ink">
                                                {row.entityType}
                                            </span>
                                            <span className="ml-auto shrink-0 text-[11px] text-ink-faint">
                                                {timeAgo(row.createdAt)}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs text-ink-faint">
                                            {row.actorName ?? row.actorEmail ?? "system"}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}
