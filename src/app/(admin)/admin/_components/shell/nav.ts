import {
    Boxes,
    FolderTree,
    Gauge,
    Layers,
    type LucideIcon,
    PackageSearch,
    Receipt,
    RotateCcw,
    ScrollText,
    ShoppingBag,
    Tags,
    Users,
} from "lucide-react";
import type { NavCounts } from "@/lib/admin/queries/admin-queries/getNavCounts";

export type BadgeKey = keyof NavCounts;

export type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
    /** совпадение только по точному пути (иначе /admin подсветится везде) */
    exact?: boolean;
    badge?: BadgeKey;
    badgeTone?: "accent" | "caution";
    /** подпункты — открываются вместе с родителем */
    children?: { href: string; label: string }[];
};

export type NavGroup = {
    id: string;
    label: string;
    icon: LucideIcon;
    /** куда ведёт иконка в рейле */
    root: string;
    items: NavItem[];
};

/** Единственный источник правды по структуре админки. */
export const NAV_GROUPS: NavGroup[] = [
    {
        id: "overview",
        label: "Overview",
        icon: Gauge,
        root: "/admin",
        items: [{ href: "/admin", label: "Dashboard", icon: Gauge, exact: true }],
    },
    {
        id: "sales",
        label: "Sales",
        icon: ShoppingBag,
        root: "/admin/orders",
        items: [
            {
                href: "/admin/orders",
                label: "Orders",
                icon: Receipt,
                badge: "toFulfill",
                badgeTone: "accent",
            },
            {
                href: "/admin/returns",
                label: "Returns",
                icon: RotateCcw,
                badge: "openReturns",
                badgeTone: "caution",
            },
        ],
    },
    {
        id: "catalog",
        label: "Catalog",
        icon: Boxes,
        root: "/admin/products",
        items: [
            {
                href: "/admin/products",
                label: "Products",
                icon: PackageSearch,
                badge: "lowStock",
                badgeTone: "caution",
                children: [{ href: "/admin/products/new", label: "New product" }],
            },
            { href: "/admin/categories", label: "Categories", icon: FolderTree },
            { href: "/admin/brands", label: "Brands", icon: Tags },
            { href: "/admin/collections", label: "Collections", icon: Layers },
        ],
    },
    {
        id: "people",
        label: "People",
        icon: Users,
        root: "/admin/users",
        items: [{ href: "/admin/users", label: "Customers", icon: Users }],
    },
    {
        id: "system",
        label: "System",
        icon: ScrollText,
        root: "/admin/audit",
        items: [{ href: "/admin/audit", label: "Activity log", icon: ScrollText }],
    },
];

export function isItemActive(pathname: string, item: NavItem) {
    return item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function groupOf(pathname: string) {
    // самый длинный совпавший href выигрывает: /admin/products бьёт /admin
    let best: { group: NavGroup; length: number } | null = null;

    for (const group of NAV_GROUPS) {
        for (const item of group.items) {
            if (isItemActive(pathname, item) && item.href.length > (best?.length ?? -1)) {
                best = { group, length: item.href.length };
            }
        }
    }

    return best?.group ?? NAV_GROUPS[0];
}

/** Быстрые действия из «плюса» в шапке */
export const QUICK_ACTIONS = [
    { href: "/admin/products/new", label: "New product" },
    { href: "/admin/collections/new", label: "New collection" },
    { href: "/admin/categories/new", label: "New category" },
    { href: "/admin/brands/new", label: "New brand" },
];
