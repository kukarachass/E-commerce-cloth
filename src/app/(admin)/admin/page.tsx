import Link from "next/link";
import { requireAdmin } from "@/lib/admin/rbac";
import {getDashboardStats} from "@/lib/admin/queries/admin-queries/getDashboardStats";
import {getRevenueByDay} from "@/lib/admin/queries/admin-queries/getRevenueByDay";
import {getOrdersToFulfill} from "@/lib/admin/queries/admin-queries/getOrdersToFulfill";
import {getLowStock} from "@/lib/admin/queries/admin-queries/getLowStock";
import {getTopProducts} from "@/lib/admin/queries/admin-queries/getTopProducts";


const eur = (n: number) =>
    new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(n);

const dayFmt = new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
});

export default async function DashboardPage() {
    await requireAdmin();

    const [stats, byDay, toFulfill, lowStock, topProducts] = await Promise.all([
        getDashboardStats(),
        getRevenueByDay(14),
        getOrdersToFulfill(),
        getLowStock(),
        getTopProducts(),
    ]);

    const maxRevenue = Math.max(...byDay.map((d) => d.revenue), 1);

    return (
        <div className="max-w-5xl">
            <h1 className="text-xl mb-6">Дашборд</h1>

            {/* ── Требует внимания ── */}
            {(stats.toFulfill > 0 || stats.openReturns > 0 || stats.lowStock > 0) && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {stats.toFulfill > 0 && (
                        <AlertChip href="/admin/orders?fulfillment=unfulfilled&payment=paid">
                            Собрать заказов: {stats.toFulfill}
                        </AlertChip>
                    )}
                    {stats.openReturns > 0 && (
                        <AlertChip href="/admin/returns?status=open">
                            Открытых возвратов: {stats.openReturns}
                        </AlertChip>
                    )}
                    {stats.lowStock > 0 && (
                        <AlertChip href="/admin/products?status=active" muted>
                            Заканчивается: {lowStock.totalLowStock} поз.
                        </AlertChip>
                    )}
                </div>
            )}

            {/* ── Цифры ── */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <Stat label="Сегодня" value={eur(stats.today.revenue)} sub={`${stats.today.orders} зак.`} />
                <Stat label="7 дней" value={eur(stats.week.revenue)} sub={`${stats.week.orders} зак.`} />
                <Stat
                    label="30 дней"
                    value={eur(stats.month.revenue)}
                    sub={
                        stats.revenueTrend === null
                            ? `${stats.month.orders} зак.`
                            : `${stats.revenueTrend > 0 ? "+" : ""}${stats.revenueTrend}% к пред. периоду`
                    }
                    trend={stats.revenueTrend}
                />
                <Stat
                    label="Новых клиентов"
                    value={String(stats.newCustomers)}
                    sub="за 30 дней"
                />
            </div>

            {/* ── График ── */}
            <section className="border rounded-md p-4 mb-6">
                <div className="text-sm text-gray-600 mb-4">Выручка, 14 дней</div>
                <div className="flex items-end gap-1 h-32">
                    {byDay.map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                            <div className="relative w-full flex-1 flex items-end">
                                <div
                                    className="w-full bg-black/80 rounded-t-sm transition-all group-hover:bg-black"
                                    style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                                />
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {eur(d.revenue)}
                </span>
                            </div>
                            <span className="text-[9px] text-gray-400">
                {dayFmt.format(new Date(d.day))}
              </span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-2 gap-6">
                {/* ── Очередь сборки ── */}
                <section className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">К сборке</span>
                        <Link href="/admin/orders" className="text-xs text-blue-600">
                            все заказы
                        </Link>
                    </div>

                    {toFulfill.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4">Всё собрано</p>
                    ) : (
                        <div className="grid gap-2">
                            {toFulfill.map((o) => (
                                <Link
                                    key={o.id}
                                    href={`/admin/orders/${o.id}`}
                                    className="flex justify-between items-center text-sm py-1 hover:bg-gray-50 rounded px-1"
                                >
                  <span className="font-mono text-blue-600">
                    #{o.id.slice(0, 8)}
                  </span>
                                    <span className="text-gray-500 truncate flex-1 mx-3">
                    {o.customerName ?? o.email}
                  </span>
                                    <span>€{o.totalAmount}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Заканчивается ── */}
                <section className="border rounded-md p-4">
                    <div className="text-sm text-gray-600 mb-3">Заканчивается на складе</div>

                    {lowStock.totalLowStock === 0 ? (
                        <p className="text-sm text-gray-400 py-4">Остатки в норме</p>
                    ) : (
                        <div className="grid gap-2">
                            {lowStock.rows.map((s, i) => (
                                <Link
                                    key={`${s.productId}-${i}`}
                                    href={`/admin/products/${s.productId}`}
                                    className="flex justify-between items-center text-sm py-1 hover:bg-gray-50 rounded px-1"
                                >
                                    <span className="truncate flex-1">{s.productName}</span>
                                    <span className="text-gray-400 text-xs mx-2 shrink-0">
                    {s.size} {s.sizeSystem}
                  </span>
                                    <span
                                        className={
                                            s.stock === 0 ? "text-red-600 shrink-0" : "text-amber-600 shrink-0"
                                        }
                                    >
                    {s.stock} шт.
                  </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* ── Топ товаров ── */}
            <section className="border rounded-md p-4 mt-6">
                <div className="text-sm text-gray-600 mb-3">Топ товаров за 30 дней</div>

                {topProducts.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4">Продаж пока нет</p>
                ) : (
                    <table className="w-full text-sm">
                        <tbody>
                        {topProducts.map((p) => (
                            <tr key={p.productId} className="border-b last:border-0">
                                <td className="py-2">
                                    <Link
                                        href={`/admin/products/${p.productId}`}
                                        className="hover:underline"
                                    >
                                        {p.name}
                                    </Link>
                                </td>
                                <td className="py-2 text-right text-gray-500 w-24">
                                    {p.sold} шт.
                                </td>
                                <td className="py-2 text-right w-24">
                                    €{Number(p.revenue ?? 0).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

/* ── компоненты ── */

function Stat({
                  label,
                  value,
                  sub,
                  trend,
              }: {
    label: string;
    value: string;
    sub: string;
    trend?: number | null;
}) {
    return (
        <div className="border rounded-md p-4">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-2xl mt-1">{value}</div>
            <div
                className={
                    "text-xs mt-1 " +
                    (trend == null
                        ? "text-gray-400"
                        : trend > 0
                            ? "text-green-600"
                            : trend < 0
                                ? "text-red-600"
                                : "text-gray-400")
                }
            >
                {sub}
            </div>
        </div>
    );
}

function AlertChip({
                       href,
                       children,
                       muted,
                   }: {
    href: string;
    children: React.ReactNode;
    muted?: boolean;
}) {
    return (
        <Link
            href={href}
            className={
                "px-3 py-1.5 rounded-md text-sm border transition " +
                (muted
                    ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                    : "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100")
            }
        >
            {children}
        </Link>
    );
}