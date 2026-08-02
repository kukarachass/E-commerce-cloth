import { ScrollText } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import getAuditLog, {
    type AuditAction,
} from "@/lib/admin/queries/audit-queries/getAuditLog";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card from "@/app/(admin)/admin/_components/ui/Card";
import FilterBar from "@/app/(admin)/admin/_components/ui/FilterBar";
import SegmentedTabs from "@/app/(admin)/admin/_components/ui/SegmentedTabs";
import Pagination from "@/app/(admin)/admin/_components/ui/Pagination";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import AuditRow from "@/app/(admin)/admin/_components/audit/AuditRow";
import { buildUrl, first, type SearchParams } from "@/app/(admin)/admin/_lib/query";

const ACTIONS: AuditAction[] = [
    "create",
    "update",
    "delete",
    "restore",
    "login",
    "export",
];

function parseAction(value: string | undefined) {
    return ACTIONS.includes(value as AuditAction)
        ? (value as AuditAction)
        : undefined;
}

export default async function AuditPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const search = first(sp.search);
    const action = parseAction(first(sp.action));
    const entityType = first(sp.entityType);
    const page = Number(first(sp.page)) || 1;

    const { rows, total, totalPages, perPage, entityTypes } = await getAuditLog({
        page,
        search,
        action,
        entityType,
    });

    const tabHref = (next?: AuditAction) =>
        buildUrl("/admin/audit", { search, entityType, action: next });

    return (
        <>
            <PageHeader
                title="Activity log"
                count={total}
                description="Who changed what, when, and from which address."
            />

            <div className="mb-4">
                <SegmentedTabs
                    size="sm"
                    items={[
                        { href: tabHref(), label: "All", active: !action },
                        ...ACTIONS.map((a) => ({
                            href: tabHref(a),
                            label: a[0].toUpperCase() + a.slice(1),
                            active: action === a,
                        })),
                    ]}
                />
            </div>

            <FilterBar
                searchValue={search}
                searchPlaceholder="Search by admin email or entity id"
                resetHref="/admin/audit"
                selects={[
                    {
                        name: "entityType",
                        value: entityType ?? "",
                        options: [
                            { value: "", label: "Entity: any" },
                            ...entityTypes.map((t) => ({ value: t, label: t })),
                        ],
                    },
                ]}
            >
                {action && <input type="hidden" name="action" value={action} />}
            </FilterBar>

            <Card padded={false} className="p-2 sm:p-3">
                {rows.length === 0 ? (
                    <EmptyState
                        icon={ScrollText}
                        title="Nothing recorded here"
                        description="Adjust the filters — the log only keeps admin actions."
                    />
                ) : (
                    <ul className="grid">
                        {rows.map((row) => (
                            <AuditRow key={row.id} row={row} />
                        ))}
                    </ul>
                )}
            </Card>

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                perPage={perPage}
                buildHref={(p) =>
                    buildUrl("/admin/audit", { search, action, entityType, page: p })
                }
            />
        </>
    );
}
