import Link from "next/link";
import { requireAdmin } from "@/lib/admin/rbac";
import { getProductList } from "@/lib/admin/queries/products";

export default async function ProductsPage({ searchParams }: {
    searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const { rows, total, page, totalPages } = await getProductList({
        page: Number(sp.page) || 1,
        search: sp.search,
        status: (sp.status as "active" | "inactive" | "all") ?? "all",
    });

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl">Товары <span className="text-gray-400">({total})</span></h1>
                <Link href="/admin/new" className="px-4 py-2 bg-black text-white rounded-md">
                    Добавить товар
                </Link>
            </div>

            <form className="flex gap-2 mb-4">
                <input
                    name="search"
                    defaultValue={sp.search ?? ""}
                    placeholder="Поиск по названию"
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <select name="status" defaultValue={sp.status ?? "all"} className="border rounded-md px-3 py-2">
                    <option value="all">Все</option>
                    <option value="active">Активные</option>
                    <option value="inactive">Скрытые</option>
                </select>
                <button className="px-4 py-2 border rounded-md">Найти</button>
            </form>

            <table className="w-full text-left text-sm">
                <thead className="text-gray-500 border-b">
                <tr>
                    <th className="py-2 font-normal">Товар</th>
                    <th className="py-2 font-normal">Бренд</th>
                    <th className="py-2 font-normal">Цена</th>
                    <th className="py-2 font-normal">Статус</th>
                    <th />
                </tr>
                </thead>
                <tbody>
                {rows.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 flex items-center gap-3">
                            {p.image && <img src={p.image} alt="" className="w-10 h-12 object-cover rounded" />}
                            <div>
                                <div>{p.name}</div>
                                <div className="text-gray-400 text-xs">{p.gender}</div>
                            </div>
                        </td>
                        <td className="py-2">{p.brandName ?? "—"}</td>
                        <td className="py-2">
                            €{p.discountPrice}
                            {p.discount > 0 && (
                                <span className="text-gray-400 line-through ml-2">€{p.originalPrice}</span>
                            )}
                        </td>
                        <td className="py-2">
                <span className={p.isActive ? "text-green-600" : "text-gray-400"}>
                  {p.isActive ? "Активен" : "Скрыт"}
                </span>
                        </td>
                        <td className="py-2 text-right">
                            <Link href={`/admin/products/${p.id}`} className="text-blue-600">
                                Изменить
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {rows.length === 0 && (
                <p className="text-gray-500 py-8 text-center">Ничего не найдено</p>
            )}

            {totalPages > 1 && (
                <div className="flex gap-2 mt-6 items-center">
                    {page > 1 && (
                        <Link href={buildUrl(sp, page - 1)} className="px-3 py-1 border rounded-md">
                            Назад
                        </Link>
                    )}
                    <span className="text-gray-500 text-sm">
            Страница {page} из {totalPages}
          </span>
                    {page < totalPages && (
                        <Link href={buildUrl(sp, page + 1)} className="px-3 py-1 border rounded-md">
                            Вперёд
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

function buildUrl(sp: Record<string, string | undefined>, page: number) {
    const params = new URLSearchParams();
    if (sp.search) params.set("search", sp.search);
    if (sp.status && sp.status !== "all") params.set("status", sp.status);
    params.set("page", String(page));
    return `/admin/products?${params}`;
}