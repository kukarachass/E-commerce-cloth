"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { LogOut, MailCheck, ShieldCheck, ShieldOff, Slash } from "lucide-react";
import { unbanUser } from "@/lib/admin/actions/users-actions/unbanUser";
import { banUser } from "@/lib/admin/actions/users-actions/banUser";
import { revokeUserSessions } from "@/lib/admin/actions/users-actions/revokeUserSessions";
import { verifyUserEmail } from "@/lib/admin/actions/users-actions/verifyUserEmail";
import { setUserRole } from "@/lib/admin/actions/users-actions/setUserRole";
import Card, { CardHeader } from "@/app/(admin)/admin/_components/ui/Card";
import Button from "@/app/(admin)/admin/_components/ui/Button";
import { Input, Select } from "@/app/(admin)/admin/_components/ui/Form";

const BAN_DURATIONS = [
    { label: "Permanent", value: 0 },
    { label: "1 day", value: 60 * 60 * 24 },
    { label: "7 days", value: 60 * 60 * 24 * 7 },
    { label: "30 days", value: 60 * 60 * 24 * 30 },
];

export default function UserActions({
    userId,
    isBanned,
    role,
    emailVerified,
}: {
    userId: string;
    isBanned: boolean;
    role: string;
    emailVerified: boolean;
}) {
    const [pending, start] = useTransition();
    const [reason, setReason] = useState("");
    const [duration, setDuration] = useState(0);

    const run = (fn: () => Promise<{ ok: boolean; message?: string }>) =>
        start(async () => {
            const res = await fn();
            if (res.ok) toast.success(res.message ?? "Done");
            else toast.error(res.message ?? "Action failed");
        });

    const isAdmin = role === "admin";

    return (
        <Card>
            <CardHeader
                title="Account actions"
                hint="Every action is written to the activity log"
            />

            <div className="grid grid-cols-1 gap-4">
                {/* доступ */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button
                        variant="outline"
                        disabled={pending}
                        onClick={() => run(() => revokeUserSessions(userId))}
                    >
                        <LogOut className="h-4 w-4" strokeWidth={1.8} />
                        Sign out everywhere
                    </Button>

                    {!emailVerified && (
                        <Button
                            variant="outline"
                            disabled={pending}
                            onClick={() => run(() => verifyUserEmail(userId))}
                        >
                            <MailCheck className="h-4 w-4" strokeWidth={1.8} />
                            Verify email manually
                        </Button>
                    )}

                    <Button
                        variant={isAdmin ? "outline" : "primary"}
                        disabled={pending}
                        onClick={() =>
                            run(() =>
                                setUserRole(userId, isAdmin ? "customer" : "admin"),
                            )
                        }
                        className="sm:col-span-2"
                    >
                        {isAdmin ? (
                            <ShieldOff className="h-4 w-4" strokeWidth={1.8} />
                        ) : (
                            <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                        )}
                        {isAdmin ? "Revoke admin rights" : "Grant admin rights"}
                    </Button>
                </div>

                {/* блокировка */}
                <div className="rounded-card border border-critical/20 bg-critical-soft/40 p-3.5">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-critical">
                        <Slash className="h-3.5 w-3.5" strokeWidth={2} />
                        Access restriction
                    </p>

                    {isBanned ? (
                        <Button
                            variant="outline"
                            disabled={pending}
                            onClick={() => run(() => unbanUser(userId))}
                        >
                            Lift the ban
                        </Button>
                    ) : (
                        // узкая колонка: поля идут в столбик, иначе поле
                        // причины схлопывается до пары букв
                        <div className="grid grid-cols-1 gap-2">
                            <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Reason for the ban"
                            />
                            <Select
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            >
                                {BAN_DURATIONS.map((d) => (
                                    <option key={d.value} value={d.value}>
                                        {d.label}
                                    </option>
                                ))}
                            </Select>
                            <Button
                                variant="danger"
                                disabled={pending || !reason.trim()}
                                onClick={() =>
                                    run(() =>
                                        banUser(userId, reason.trim(), duration || undefined),
                                    )
                                }
                            >
                                Ban account
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
