import Link from "next/link";
import { requireAdmin } from "@/lib/admin/rbac";
import getAuditLog, { AuditAction } from "@/lib/admin/queries/audit-queries/getAuditLog";
import AuditRow from "@/app/(admin)/admin/_components/audit/AuditRow";

const ACTIONS: AuditAction[] = ["create", "update", "delete", "restore", "login", "export"];

export default async function AuditPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ page?: string; search?: string; action?: string; entityType?: string }>;
}) {
    await requireAdmin();
    const sp = await searchParams;

    const { rows, total, page, totalPages, entityTypes } = await getAuditLog({
        page: Number(sp.page) || 1,
        search: sp.search,
        action: sp.action as AuditAction | undefined,
        entityType: sp.entityType,
    });

    return (
        <div className="p-6">
            <h1 className="text-lg font-semibold mb-4">Аудит ({total})</h1>

            <form method="get" className="flex flex-wrap gap-2 mb-4">
                <input
                    name="search"
                    defaultValue={sp.search ?? ""}
                    placeholder="Email админа или ID сущности"
                    className="border rounded-md px-3 py-2 flex-1 min-w-60"
                />

                <select
                    name="action"
                    defaultValue={sp.action ?? ""}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="">Все действия</option>
                    {ACTIONS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </select>

                <select
                    name="entityType"
                    defaultValue={sp.entityType ?? ""}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="">Все сущности</option>
                    {entityTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <button className="px-4 py-2 border rounded-md">Найти</button>
            </form>

            <table className="w-full text-left text-sm border">
                <thead className="bg-gray-100 border-b text-gray-500">
                <tr>
                    <th className="py-2 px-3 font-normal">Когда</th>
                    <th className="py-2 px-3 font-normal">Кто</th>
                    <th className="py-2 px-3 font-normal">Действие</th>
                    <th className="py-2 px-3 font-normal">Сущность</th>
                    <th className="py-2 px-3 font-normal">IP</th>
                    <th className="py-2 px-3 font-normal">Изменения</th>
                </tr>
                </thead>
                <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="py-6 text-center text-gray-400">
                            Записей нет
                        </td>
                    </tr>
                ) : (
                    rows.map((row) => <AuditRow key={row.id} row={row} />)
                )}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            href={{ pathname: "/admin/audit", query: { ...sp, page: p } }}
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