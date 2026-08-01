"use client";

import {useState, useTransition} from "react";
import {toast} from "sonner";
import {unbanUser} from "@/lib/admin/actions/users-actions/unbanUser";
import {banUser} from "@/lib/admin/actions/users-actions/banUser";
import {revokeUserSessions} from "@/lib/admin/actions/users-actions/revokeUserSessions";
import {verifyUserEmail} from "@/lib/admin/actions/users-actions/verifyUserEmail";
import {setUserRole} from "@/lib/admin/actions/users-actions/setUserRole";

const BAN_DURATIONS = [
    {label: "Навсегда", value: 0},
    {label: "1 день", value: 60 * 60 * 24},
    {label: "7 дней", value: 60 * 60 * 24 * 7},
    {label: "30 дней", value: 60 * 60 * 24 * 30},
];

export default function UserActions({
                                        userId, isBanned, role, emailVerified,
                                    }: {
    userId: string;
    isBanned: boolean;
    role: string;
    emailVerified: boolean;
}) {
    const [pending, start] = useTransition();
    const [reason, setReason] = useState("");
    const [duration, setDuration] = useState(0);

    const run = (fn: () => Promise<{ ok: boolean; message?: string }>) => {
        start(async () => {
            const res = await fn();
            if (res.ok) toast.success(res.message ?? "Готово");
            else toast.error(res.message ?? "Ошибка");
        });
    };

    return (
        <div className="border rounded-md p-4 space-y-4">
            <h2 className="font-semibold">Действия</h2>

            {isBanned ? (
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => unbanUser(userId))}
                    className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
                >
                    Снять блокировку
                </button>
            ) : (
                <div className="flex flex-wrap gap-2 items-center">
                    <input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Причина блокировки"
                        className="border rounded-md px-3 py-2 text-sm flex-1 min-w-50"
                    />
                    <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="border rounded-md px-3 py-2 text-sm"
                    >
                        {BAN_DURATIONS.map((d) => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        disabled={pending || !reason.trim()}
                        onClick={() =>
                            run(() => banUser(userId, reason.trim(), duration || undefined))
                        }
                        className="px-4 py-2 bg-red-600 text-black rounded-md text-sm disabled:opacity-50"
                    >
                        Заблокировать
                    </button>
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => run(() => revokeUserSessions(userId))}
                    className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
                >
                    Завершить все сессии
                </button>

                {!emailVerified && (
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => run(() => verifyUserEmail(userId))}
                        className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
                    >
                        Подтвердить email вручную
                    </button>
                )}

                <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                        run(() =>
                            setUserRole(userId, role === "admin" ? "customer" : "admin"),
                        )
                    }
                    className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
                >
                    {role === "admin" ? "Забрать права админа" : "Сделать админом"}
                </button>
            </div>
        </div>
    );
}