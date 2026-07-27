import Link from "next/link";
import { requireAdmin } from "@/lib/admin/rbac";
import { getReturnList } from "@/lib/admin/queries/returns";
import FilterTab from "@/app/(admin)/admin/_components/returns/FilterTab";

const STATUS_LABELS = { open: "Открыта", closed: "Закрыта" } as const;

const dateFmt = new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

type SearchParams = { [key: string]: string | string[] | undefined };

function first(v: string | string[] | undefined) {
    return Array.isArray(v) ? v[0] : v;
}

function parseStatus(v: string | string[] | undefined) {
    const s = first(v);
    return s === "open" || s === "closed" ? s : undefined;
}

export default async function ReturnsPage({
                                              searchParams,
                                          }: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const status = parseStatus(sp.status);
    const page = Number(first(sp.page)) || 1;

    const { rows, total, totalPages } = await getReturnList({ page, status });

    return (
        <div className="w-full">
            <h1 className="text-xl mb-6">
                Возвраты <span className="text-gray-400">({total})</span>
            </h1>

            {/* Фильтр по статусу — обычные ссылки, без формы */}
            <div className="flex gap-2 mb-4 text-sm">
                <FilterTab href="/admin/returns" active={!status}>
                    Все
                </FilterTab>
                <FilterTab href="/admin/returns?status=open" active={status === "open"}>
                    Открытые
                </FilterTab>
                <FilterTab
                    href="/admin/returns?status=closed"
                    active={status === "closed"}
                >
                    Закрытые
                </FilterTab>
            </div>

            <table className="w-full text-left text-sm">
                <thead className="text-gray-500 border-b">
                <tr>
                    <th className="py-2 font-normal">Заявка</th>
                    <th className="py-2 font-normal">Заказ</th>
                    <th className="py-2 font-normal">Клиент</th>
                    <th className="py-2 font-normal">Позиций</th>
                    <th className="py-2 font-normal">Возвращено</th>
                    <th className="py-2 font-normal">Статус</th>
                    <th className="py-2 font-normal">Дата</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">
                            <Link
                                href={`/admin/returns/${r.id}`}
                                className="text-blue-600 font-mono"
                            >
                                #{r.id.slice(0, 8)}
                            </Link>
                        </td>
                        <td className="py-2">
                            <Link
                                href={`/admin/orders/${r.orderId}`}
                                className="text-gray-600 font-mono hover:underline"
                            >
                                #{r.orderId.slice(0, 8)}
                            </Link>
                        </td>
                        <td className="py-2">
                            <div>{r.customerName ?? "Гость"}</div>
                            <div className="text-gray-400 text-xs">{r.email}</div>
                        </td>
                        <td className="py-2">{r.itemCount}</td>
                        <td className="py-2">
                            {r.refundedAmount > 0
                                ? `€${(r.refundedAmount / 100).toFixed(2)}`
                                : "—"}
                        </td>
                        <td className="py-2">
                <span
                    className={
                        r.status === "open" ? "text-amber-600" : "text-gray-500"
                    }
                >
                  {STATUS_LABELS[r.status]}
                </span>
                        </td>
                        <td className="py-2 text-gray-500">{dateFmt.format(r.createdAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {rows.length === 0 && (
                <p className="text-gray-500 py-8 text-center">Заявок не найдено</p>
            )}

            {totalPages > 1 && (
                <div className="flex gap-2 mt-6 items-center">
                    {page > 1 && (
                        <Link
                            href={buildUrl(status, page - 1)}
                            className="px-3 py-1 border rounded-md"
                        >
                            Назад
                        </Link>
                    )}
                    <span className="text-gray-500 text-sm">
            Страница {page} из {totalPages}
          </span>
                    {page < totalPages && (
                        <Link
                            href={buildUrl(status, page + 1)}
                            className="px-3 py-1 border rounded-md"
                        >
                            Вперёд
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}



function buildUrl(status: "open" | "closed" | undefined, page: number) {
    const p = new URLSearchParams();
    if (status) p.set("status", status);
    p.set("page", String(page));
    return `/admin/returns?${p}`;
}