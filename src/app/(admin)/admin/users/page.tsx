import { CreditCard, Users } from "lucide-react";
import { requireAdmin } from "@/lib/admin/rbac";
import getUsers from "@/lib/admin/queries/users-queries/users";

import PageHeader from "@/app/(admin)/admin/_components/ui/PageHeader";
import Card from "@/app/(admin)/admin/_components/ui/Card";
import DataTable, { type Column } from "@/app/(admin)/admin/_components/ui/DataTable";
import FilterBar from "@/app/(admin)/admin/_components/ui/FilterBar";
import Pagination from "@/app/(admin)/admin/_components/ui/Pagination";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import { GENDER_LABELS } from "@/app/(admin)/admin/_lib/labels";
import { buildUrl, first, type SearchParams } from "@/app/(admin)/admin/_lib/query";

type UserRow = Awaited<ReturnType<typeof getUsers>>["rows"][number];

const GENDERS = ["all", "men", "women"] as const;
type GenderFilter = (typeof GENDERS)[number];

function parseGender(value: string | undefined): GenderFilter {
    return GENDERS.includes(value as GenderFilter)
        ? (value as GenderFilter)
        : "all";
}

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;
    const search = first(sp.search);
    const gender = parseGender(first(sp.gender));
    const page = Number(first(sp.page)) || 1;

    const { rows, total, totalPages, perPage } = await getUsers({
        page,
        search,
        gender,
    });

    const columns: Column<UserRow>[] = [
        {
            key: "customer",
            header: "Customer",
            width: "minmax(0,2fr)",
            mobile: "title",
            cell: (u) => (
                <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={u.name} email={u.email} src={u.image} size="md" />
                    <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">
                            {[u.name, u.lastName].filter(Boolean).join(" ") || "Unnamed"}
                        </span>
                        <span className="block truncate text-xs text-ink-faint">
                            {u.email}
                        </span>
                    </span>
                </span>
            ),
        },
        {
            key: "phone",
            header: "Phone",
            width: "minmax(0,1fr)",
            label: "Phone",
            cell: (u) => (
                <span className="tnum truncate text-ink-soft">
                    {u.phoneNumber ?? "—"}
                </span>
            ),
        },
        {
            key: "gender",
            header: "Shops for",
            width: "120px",
            label: "Shops for",
            cell: (u) =>
                u.gender ? (
                    <Badge tone="neutral">{GENDER_LABELS[u.gender] ?? u.gender}</Badge>
                ) : (
                    <span className="text-xs text-ink-faint">—</span>
                ),
        },
        {
            key: "stripe",
            header: "Billing",
            width: "120px",
            label: "Billing",
            cell: (u) =>
                u.stripeCustomerId ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                        <CreditCard className="h-3.5 w-3.5" strokeWidth={1.8} />
                        Linked
                    </span>
                ) : (
                    <span className="text-xs text-ink-faint">—</span>
                ),
        },
        {
            key: "verified",
            header: "Email",
            width: "130px",
            align: "right",
            label: "Email",
            mobile: "trailing",
            cell: (u) => (
                <Badge tone={u.emailVerified ? "positive" : "caution"} dot>
                    {u.emailVerified ? "Verified" : "Unverified"}
                </Badge>
            ),
        },
    ];

    return (
        <>
            <PageHeader
                title="Customers"
                count={total}
                description="Accounts, contact details and their shopping history."
            />

            <FilterBar
                searchValue={search}
                searchPlaceholder="Search by name or email"
                resetHref="/admin/users"
                selects={[
                    {
                        name: "gender",
                        value: gender,
                        options: [
                            { value: "all", label: "Audience: any" },
                            { value: "women", label: "Women" },
                            { value: "men", label: "Men" },
                        ],
                    },
                ]}
            />

            <Card padded={false} className="p-2 sm:p-3">
                <DataTable
                    columns={columns}
                    rows={rows}
                    getKey={(u) => u.id}
                    href={(u) => `/admin/users/${u.id}`}
                    empty={
                        <EmptyState
                            icon={Users}
                            title="No customers found"
                            description="Try a different search or clear the filters."
                        />
                    }
                />
            </Card>

            <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                perPage={perPage}
                buildHref={(p) => buildUrl("/admin/users", { search, gender, page: p })}
            />
        </>
    );
}
