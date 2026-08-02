"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import cn from "@/app/(admin)/admin/_lib/cn";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import Avatar from "@/app/(admin)/admin/_components/ui/Avatar";
import { formatDateTime, timeAgo } from "@/app/(admin)/admin/_lib/format";
import {
    AUDIT_ACTION_TONES,
    humanizeKey,
} from "@/app/(admin)/admin/_lib/labels";

type Json = Record<string, unknown> | null;

export type AuditRowData = {
    id: string;
    actorEmail: string | null;
    actorName: string | null;
    action: string;
    entityType: string;
    entityId: string | null;
    before: unknown;
    after: unknown;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
};

/** Изменившиеся поля: ключи из before и after вместе */
function buildDiff(before: Json, after: Json) {
    const keys = new Set([
        ...Object.keys(before ?? {}),
        ...Object.keys(after ?? {}),
    ]);

    return [...keys]
        .map((key) => ({ key, from: before?.[key], to: after?.[key] }))
        .filter((d) => JSON.stringify(d.from) !== JSON.stringify(d.to));
}

function render(value: unknown) {
    if (value === undefined) return "—";
    if (value === null) return "null";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

export default function AuditRow({ row }: { row: AuditRowData }) {
    const [open, setOpen] = useState(false);

    const diff = buildDiff(row.before as Json, row.after as Json);
    const expandable = diff.length > 0 || Boolean(row.userAgent);

    return (
        <li className="border-b border-line last:border-0">
            <button
                type="button"
                onClick={() => expandable && setOpen((v) => !v)}
                disabled={!expandable}
                className={cn(
                    "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-2.5 py-3 text-left transition-colors",
                    expandable ? "hover:bg-sunk" : "cursor-default",
                )}
            >
                <Avatar name={row.actorName} email={row.actorEmail} size="sm" />

                <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                        <Badge tone={AUDIT_ACTION_TONES[row.action] ?? "neutral"}>
                            {row.action}
                        </Badge>
                        <span className="text-sm font-medium text-ink">
                            {row.entityType}
                        </span>
                        {row.entityId && (
                            <span className="font-mono text-[11px] text-ink-faint">
                                {row.entityId.slice(0, 8)}
                            </span>
                        )}
                        {diff.length > 0 && (
                            <span className="text-[11px] text-accent">
                                {diff.length} field{diff.length === 1 ? "" : "s"} changed
                            </span>
                        )}
                    </span>

                    <span className="mt-1 block truncate text-xs text-ink-faint">
                        {row.actorName ?? "—"}
                        {row.actorEmail ? ` · ${row.actorEmail}` : ""}
                        {row.ipAddress ? ` · ${row.ipAddress}` : ""}
                    </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                    <span className="text-right text-[11px] text-ink-faint">
                        <span className="block">{timeAgo(row.createdAt)}</span>
                        <span className="hidden sm:block">
                            {formatDateTime(row.createdAt)}
                        </span>
                    </span>
                    {expandable && (
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 text-ink-faint transition-transform duration-200",
                                open && "rotate-180",
                            )}
                        />
                    )}
                </span>
            </button>

            {open && (
                <div className="mb-3 grid grid-cols-1 gap-3 rounded-card bg-sunk p-3.5">
                    {diff.length > 0 && (
                        <div className="grid grid-cols-1 gap-1.5">
                            {diff.map((d) => (
                                <div
                                    key={d.key}
                                    className="grid grid-cols-1 gap-1 rounded-xl bg-card px-3 py-2 sm:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-3"
                                >
                                    <span className="text-xs font-medium text-ink">
                                        {humanizeKey(d.key)}
                                    </span>
                                    <span className="min-w-0 text-xs break-all text-critical line-through">
                                        {render(d.from)}
                                    </span>
                                    <span className="min-w-0 text-xs break-all text-positive">
                                        {render(d.to)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {row.userAgent && (
                        <p className="text-[11px] break-all text-ink-faint">
                            {row.userAgent}
                        </p>
                    )}
                </div>
            )}
        </li>
    );
}
