import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import { getReturnDetail } from "@/lib/admin/queries/returns";
import {
    ITEM_LABELS,
    REASON_LABELS,
    refundableCents,
    type ReturnItemStatus,
} from "@/lib/admin/returns/rules";
import {ItemDecision, RefundButton} from "@/app/(admin)/admin/_components/returns/ReturnActions";

const STATUS_COLOR: Record<ReturnItemStatus, string> = {
    requested: "text-amber-600",
    approved: "text-blue-600",
    refunded: "text-green-600",
    rejected: "text-red-600",
    cancelled: "text-gray-400",
};

type Snapshot = { name?: string; image?: string };

export default async function ReturnDetailPage({
                                                   params,
                                               }: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const r = await getReturnDetail(id);
    if (!r) notFound();

    const approved = r.items.filter((i) => i.status === "approved");
    const notRestocked = approved.filter((i) => !i.restocked);
    const amountCents = refundableCents(
        approved.map((i) => ({
            status: i.status,
            price: i.price,
            quantity: i.quantity,
        })),
    );

    // Причина, по которой возврат денег недоступен — считаем на сервере,
    // теми же правилами, что применит экшен
    const blockedReason = r.stripeRefundId
        ? `Возврат уже сделан: €${(r.refundedAmount / 100).toFixed(2)}`
        : approved.length === 0
            ? "Нет одобренных позиций"
            : notRestocked.length > 0
                ? `Сначала примите товар на склад (${notRestocked.length} поз.)`
                : undefined;

    return (
        <div className="max-w-4xl">
            <Link href="/admin/returns" className="text-sm text-gray-500">
                ← К списку
            </Link>

            <div className="flex items-start justify-between mt-2 mb-6">
                <div>
                    <h1 className="text-xl font-mono">#{r.id.slice(0, 8)}</h1>
                    <p className="text-sm text-gray-500">
                        Заказ{" "}
                        <Link
                            href={`/admin/orders/${r.orderId}`}
                            className="text-blue-600 font-mono hover:underline"
                        >
                            #{r.orderId.slice(0, 8)}
                        </Link>
                        {" · "}
                        {new Intl.DateTimeFormat("nl-NL", {
                            dateStyle: "long",
                            timeStyle: "short",
                        }).format(r.createdAt)}
                    </p>
                </div>
                <span
                    className={
                        r.status === "open"
                            ? "text-amber-600 text-sm"
                            : "text-gray-500 text-sm"
                    }
                >
          {r.status === "open" ? "Открыта" : "Закрыта"}
        </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <section className="border rounded-md p-4">
                    <div className="text-sm text-gray-600 mb-2">Клиент</div>
                    <div>{r.user?.name ?? "Гость"}</div>
                    <div className="text-sm text-gray-500">
                        {r.user?.email ?? r.order?.email}
                    </div>
                </section>

                <section className="border rounded-md p-4">
                    <div className="text-sm text-gray-600 mb-2">Возврат денег</div>
                    <RefundButton
                        requestId={r.id}
                        amountCents={amountCents}
                        blockedReason={blockedReason}
                    />
                    {r.stripeRefundId && (
                        <p className="text-xs text-gray-400 font-mono mt-2">
                            {r.stripeRefundId}
                        </p>
                    )}
                </section>
            </div>

            {(r.customerNote || r.adminNote) && (
                <section className="border rounded-md p-4 mb-6 text-sm grid gap-2">
                    {r.customerNote && (
                        <div>
                            <span className="text-gray-500">Комментарий клиента: </span>
                            {r.customerNote}
                        </div>
                    )}
                    {r.adminNote && (
                        <div>
                            <span className="text-gray-500">内 Внутренняя пометка: </span>
                            {r.adminNote}
                        </div>
                    )}
                </section>
            )}

            <section className="border rounded-md p-4">
                <div className="text-sm text-gray-600 mb-3">
                    Позиции ({r.items.length})
                </div>

                <div className="grid gap-3">
                    {r.items.map((item) => {
                        const snap = (item.orderItem?.productSnapshot ?? {}) as Snapshot;
                        return (
                            <div
                                key={item.id}
                                className="flex gap-4 items-start border-b last:border-0 pb-3 last:pb-0"
                            >
                                {snap.image && (
                                    <img
                                        src={snap.image}
                                        alt=""
                                        className="w-12 h-14 object-cover rounded shrink-0"
                                    />
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm">{snap.name ?? "Товар удалён"}</div>
                                    <div className="text-xs text-gray-400">
                                        Размер {item.orderItem?.size} · {item.quantity} шт. · €
                                        {(Number(item.price) * item.quantity).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Причина: {REASON_LABELS[item.reason] ?? item.reason}
                                    </div>
                                </div>

                                <div className="text-right shrink-0 grid gap-2">
                  <span className={`text-xs ${STATUS_COLOR[item.status]}`}>
                    {ITEM_LABELS[item.status]}
                  </span>
                                    <ItemDecision
                                        itemId={item.id}
                                        status={item.status}
                                        restocked={item.restocked}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}