import Link from "next/link";
import getUsers from "@/lib/admin/queries/users-queries/users";
import {Gender} from "@/hooks/useGender";

export default async function UsersPage(
    {searchParams}: { searchParams: Promise<{ page?: string; search?: string; gender?: Gender | "all" }> }
) {
    const sp = await searchParams;

    const {rows, total, page, totalPages} = await getUsers({
        page: Number(sp.page) || 1,
        search: sp.search,
        gender: (sp.gender as "men" | "women" | "all") ?? "all",
    });

    return (
        <div>
            <h1 className="text-lg font-semibold mb-4">Пользователи ({total})</h1>

            <form method="get" className="flex gap-2 mb-4">
                <input
                    name="search"
                    defaultValue={sp.search ?? ""}
                    placeholder="Поиск по имени или почте"
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <select name="gender" defaultValue={sp.gender ?? "all"} className="border rounded-md px-3 py-2">
                    <option value="all">Все</option>
                    <option value="men">Мужчина</option>
                    <option value="women">Женщина</option>
                </select>
                <button className="px-4 py-2 border rounded-md">Найти</button>
            </form>

            <table className="w-full text-left text-sm border">
                <thead className="bg-gray-100 border-b">
                <tr>
                    <th className="py-2 px-3">Id</th>
                    <th className="py-2 px-3">Имя</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Телефон</th>
                    <th className="py-2 px-3">Пол</th>
                    <th className="py-2 px-3">Подтвержден</th>
                </tr>
                </thead>
                <tbody>
                {rows.length === 0 && (
                    <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-400">
                            Пользователи не найдены
                        </td>
                    </tr>
                )}
                {rows.map((u) => (
                    <tr key={u.id} className="border-b">
                        <td className="py-2 px-3 flex gap-2">
                            {u.id}
                            <Link href={`/admin/users/${u.id}`}>
                                Go to
                            </Link>
                        </td>
                        <td className="py-2 px-3">
                            {u.name} {u.lastName ?? ""}
                        </td>
                        <td className="py-2 px-3">{u.email}</td>
                        <td className="py-2 px-3 text-center">{u.phoneNumber ?? "—"}</td>
                        <td className="py-2 px-3 text-center">{u.gender}</td>
                        <td className="py-2 px-3 text-center">{u.emailVerified ? "да" : "нет"}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex gap-2 mt-4">
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            href={{
                                pathname: "/admin/users",
                                query: {...sp, page: p},
                            }}
                            className={
                                "px-3 py-1 border rounded-md " +
                                (p === page ? "bg-black text-white" : "")
                            }
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}