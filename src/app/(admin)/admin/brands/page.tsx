import Link from "next/link";
import { requireAdmin } from "@/lib/admin/rbac";
import { getBrandList } from "@/lib/admin/queries/brands";

export default async function BrandsPage({
                                             searchParams,
                                         }: {
    searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const search = Array.isArray(sp.search) ? sp.search[0] : sp.search;
    const page = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1;

    const { rows, total, totalPages } = await getBrandList({ page, search });

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl">
                    Бренды <span className="text-gray-400">({total})</span>
                </h1>
                <Link href="/admin/brands/new" className="px-4 py-2 bg-black text-white rounded-md">
                    Добавить бренд
                </Link>
            </div>

            <form className="flex gap-2 mb-4">
                <input
                    name="search"
                    defaultValue={search ?? ""}
                    placeholder="Поиск по названию"
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <button className="px-4 py-2 border rounded-md">Найти</button>
            </form>

            <table className="w-full text-left text-sm">
                <thead className="text-gray-500 border-b">
                <tr>
                    <th className="py-2 font-normal">Бренд</th>
                    <th className="py-2 font-normal">Теги</th>
                    <th className="py-2 font-normal">Товаров</th>
                    <th className="py-2 font-normal">Статус</th>
                    <th />
                </tr>
                </thead>
                <tbody>
                {rows.map((b) => (
                    <tr key={b.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 flex items-center gap-3">
                            <img src={b.imageUrl} alt="" className="w-10 h-10 object-contain rounded bg-gray-50" />
                            <div>
                                <div>{b.name}</div>
                                <div className="text-gray-400 text-xs">/{b.slug}</div>
                            </div>
                        </td>
                        <td className="py-2">
                            <div className="flex flex-wrap gap-1">
                                {b.tags.map((t) => (
                                    <span key={t} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                      {t}
                    </span>
                                ))}
                            </div>
                        </td>
                        <td className="py-2">{String(b.productCount)}</td>
                        <td className="py-2">
                <span className={b.isActive ? "text-green-600" : "text-gray-400"}>
                  {b.isActive ? "Активен" : "Скрыт"}
                </span>
                        </td>
                        <td className="py-2 text-right">
                            <Link href={`/admin/brands/${b.id}`} className="text-blue-600">
                                Изменить
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {rows.length === 0 && (
                <p className="text-gray-500 py-8 text-center">Брендов не найдено</p>
            )}

            {totalPages > 1 && (
                <div className="flex gap-2 mt-6 items-center">
                    {page > 1 && (
                        <Link href={`/admin/brands?page=${page - 1}`} className="px-3 py-1 border rounded-md">
                            Назад
                        </Link>
                    )}
                    <span className="text-gray-500 text-sm">Страница {page} из {totalPages}</span>
                    {page < totalPages && (
                        <Link href={`/admin/brands?page=${page + 1}`} className="px-3 py-1 border rounded-md">
                            Вперёд
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}