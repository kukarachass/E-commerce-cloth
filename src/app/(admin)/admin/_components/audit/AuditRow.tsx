"use client";

import { useState } from "react";
import {formatDateTime} from "@/lib/formatDate";

const ACTION_STYLES: Record<string, string> = {
    create:  "bg-green-100 text-green-700",
    update:  "bg-blue-100 text-blue-700",
    delete:  "bg-red-100 text-red-700",
    restore: "bg-amber-100 text-amber-700",
    login:   "bg-gray-100 text-gray-600",
    export:  "bg-purple-100 text-purple-700",
};

type Json = Record<string, unknown> | null;

/** Собираем список изменившихся полей: ключи из before и after вместе */
function buildDiff(before: Json, after: Json) {
    const keys = new Set([
        ...Object.keys(before ?? {}),
        ...Object.keys(after ?? {}),
    ]);

    return [...keys]
        .map((key) => ({
            key,
            from: before?.[key],
            to: after?.[key],
        }))
        .filter((d) => JSON.stringify(d.from) !== JSON.stringify(d.to));
}

function render(value: unknown) {
    if (value === undefined) return "—";
    if (value === null) return "null";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

export default function AuditRow({
                                     row,
                                 }: {
    row: {
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
}) {
    const [open, setOpen] = useState(false);

    const before = row.before as Json;
    const after = row.after as Json;
    const diff = buildDiff(before, after);
    const hasPayload = diff.length > 0;

    return (
        <>
            <tr
                className={"border-b " + (hasPayload ? "cursor-pointer hover:bg-gray-50" : "")}
                onClick={() => hasPayload && setOpen((v) => !v)}
            >
                <td className="py-2 px-3 whitespace-nowrap text-gray-500">
                    {formatDateTime(row.createdAt)}
                </td>
                <td className="py-2 px-3">
                    <div>{row.actorName ?? "—"}</div>
                    <div className="text-xs text-gray-400">{row.actorEmail ?? "удалён"}</div>
                </td>
                <td className="py-2 px-3">
                    <span
                        className={
                            "px-2 py-0.5 rounded text-xs " +
                            (ACTION_STYLES[row.action] ?? "bg-gray-100 text-gray-600")
                        }
                    >
                        {row.action}
                    </span>
                </td>
                <td className="py-2 px-3">
                    <div>{row.entityType}</div>
                    <div className="text-xs text-gray-400 font-mono">
                        {row.entityId ? row.entityId.slice(0, 8) : "—"}
                    </div>
                </td>
                <td className="py-2 px-3 text-gray-500">{row.ipAddress ?? "—"}</td>
                <td className="py-2 px-3 text-gray-400 text-xs">
                    {hasPayload ? (open ? "свернуть" : `${diff.length} изм.`) : "—"}
                </td>
            </tr>

            {open && (
                <tr className="border-b bg-gray-50">
                    <td colSpan={6} className="px-3 py-3">
                        <table className="w-full text-xs">
                            <thead className="text-gray-400">
                            <tr>
                                <th className="text-left py-1 w-48">Поле</th>
                                <th className="text-left py-1">Было</th>
                                <th className="text-left py-1">Стало</th>
                            </tr>
                            </thead>
                            <tbody>
                            {diff.map((d) => (
                                <tr key={d.key} className="align-top">
                                    <td className="py-1 font-mono">{d.key}</td>
                                    <td className="py-1 text-red-600 break-all">{render(d.from)}</td>
                                    <td className="py-1 text-green-700 break-all">{render(d.to)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {row.userAgent && (
                            <p className="text-xs text-gray-400 mt-3 break-all">
                                UA: {row.userAgent}
                            </p>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
}