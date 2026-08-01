import Link from "next/link";
import {requireAdmin} from "@/lib/admin/rbac";
import {getCollectionsList} from "@/lib/admin/queries/collections";

const GENDER_LABEL: Record<string, string> = {
    women: "Женское",
    men: "Мужское",
    unisex: "Унисекс",
};

interface Props {
    searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}

export default async function CollectionsPage({searchParams}: Props) {
    await requireAdmin();

    const sp = await searchParams;
    const search = Array.isArray(sp.search) ? sp.search[0] : sp.search;
    const page = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1;

    const {rows, totalPages, total} = await getCollectionsList({page, search});

    const pageUrl = (p: number) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        params.set("page", String(p));
        return `/admin/collections?${params}`;
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl">
                    Коллекции <span className="text-gray-400">({total})</span>
                </h1>
                <Link
                    href="/admin/collections/new"
                    className="px-4 py-2 bg-black text-white rounded-md"
                >
                    Добавить коллекцию
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
                    <th className="py-2 font-normal">Коллекция</th>
                    <th className="py-2 font-normal">Гендер</th>
                    <th className="py-2 font-normal">Товаров</th>
                    <th className="py-2 font-normal">Статус</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {rows.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">
                            <div className="flex items-center gap-3">
                                {c.banner ? (
                                    <img
                                        src={c.banner}
                                        alt=""
                                        className="w-16 h-10 object-cover rounded bg-gray-50"
                                    />
                                ) : (
                                    <div className="w-16 h-10 rounded bg-gray-100 shrink-0"/>
                                )}
                                <div>
                                    <div>{c.title}</div>
                                    <div className="text-gray-400 text-xs">/{c.slug}</div>
                                </div>
                            </div>
                        </td>

                        <td className="py-2 text-gray-600">
                            {GENDER_LABEL[c.gender] ?? c.gender}
                        </td>

                        <td className="py-2">
                <span className={c.isActive ? "text-green-600" : "text-gray-400"}>
                  {c.isActive ? "Активна" : "Скрыта"}
                </span>
                        </td>

                        <td className="py-2 text-right">
                            <Link
                                href={`/admin/collections/${c.id}`}
                                className="text-blue-600"
                            >
                                Изменить
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {rows.length === 0 && (
                <p className="text-gray-500 py-8 text-center">Коллекций не найдено</p>
            )}

            {totalPages > 1 && (
                <div className="flex gap-2 mt-6 items-center">
                    {page > 1 && (
                        <Link href={pageUrl(page - 1)} className="px-3 py-1 border rounded-md">
                            Назад
                        </Link>
                    )}
                    <span className="text-gray-500 text-sm">
            Страница {page} из {totalPages}
          </span>
                    {page < totalPages && (
                        <Link href={pageUrl(page + 1)} className="px-3 py-1 border rounded-md">
                            Вперёд
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}