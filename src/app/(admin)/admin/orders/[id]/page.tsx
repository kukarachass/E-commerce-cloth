import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import { getOrderDetail } from "@/lib/admin/queries/orders";
import {
    availableTransitions,
    FULFILLMENT_LABELS,
} from "@/lib/admin/orders/transitions";
import type { OrderPaymentStatus } from "@/types/IOrder";
import OrderStatusActions from "@/app/(admin)/admin/_components/orders/OrderStatusActions";

const PAYMENT_LABELS: Record<OrderPaymentStatus, string> = {
    pending: "Ожидает оплаты",
    paid: "Оплачен",
    failed: "Ошибка оплаты",
    expired: "Истёк",
    refunded: "Возвращён",
    partially_refunded: "Частичный возврат",
};

type Address = {
    street?: string;
    houseNumber?: string;
    houseAddition?: string | null;
    postcode?: string;
    city?: string;
    country?: string;
};

type Snapshot = { name?: string; image?: string; slug?: string };

export default async function OrderDetailPage({
                                                  params,
                                              }: {
    params: Promise<{ id: string }>;
}) {
    await requireAdmin();
    const { id } = await params;

    const o = await getOrderDetail(id);
    if (!o) notFound();

    const addr = (o.addressSnapshot ?? {}) as Address;
    const actions = availableTransitions(o.fulfillmentStatus, o.paymentStatus);
    const lastPayment = o.payments[0];

    return (
        <div className="max-w-4xl">
            <Link href="/admin/orders" className="text-sm text-gray-500">
                ← К списку
            </Link>

            <div className="flex items-start justify-between mt-2 mb-6">
                <div>
                    <h1 className="text-xl font-mono">#{o.id.slice(0, 8)}</h1>
                    <p className="text-sm text-gray-500">
                        {new Intl.DateTimeFormat("nl-NL", {
                            dateStyle: "long",
                            timeStyle: "short",
                        }).format(o.createdAt)}
                    </p>
                </div>
                <div className="text-right text-sm">
                    <div>{PAYMENT_LABELS[o.paymentStatus]}</div>
                    <div className="text-gray-500">
                        {FULFILLMENT_LABELS[o.fulfillmentStatus]}
                    </div>
                </div>
            </div>

            {/* Действия */}
            <section className="border rounded-md p-4 mb-6">
                <div className="text-sm text-gray-600 mb-3">Действия</div>
                <OrderStatusActions orderId={o.id} actions={actions} />
                {o.paymentStatus !== "paid" && actions.length === 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                        Сборка и отправка доступны только после оплаты
                    </p>
                )}
            </section>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <section className="border rounded-md p-4">
                    <div className="text-sm text-gray-600 mb-2">Клиент</div>
                    <div>{o.user?.name ?? "Гость"}</div>
                    <div className="text-sm text-gray-500">{o.email}</div>
                    {o.comment && (
                        <p className="text-sm mt-3 text-gray-600">
                            Комментарий: {o.comment}
                        </p>
                    )}
                </section>

                <section className="border rounded-md p-4">
                    <div className="text-sm text-gray-600 mb-2">Адрес доставки</div>
                    <div className="text-sm">
                        {addr.street} {addr.houseNumber}
                        {addr.houseAddition ? `-${addr.houseAddition}` : ""}
                        <br />
                        {addr.postcode} {addr.city}
                        <br />
                        {addr.country}
                    </div>
                </section>
            </div>

            {/* Позиции */}
            <section className="border rounded-md p-4 mb-6">
                <div className="text-sm text-gray-600 mb-3">
                    Позиции ({o.items.length})
                </div>
                <table className="w-full text-sm">
                    <tbody>
                    {o.items.map((item) => {
                        const snap = (item.productSnapshot ?? {}) as Snapshot;
                        return (
                            <tr key={item.id} className="border-b last:border-0">
                                <td className="py-2">
                                    {snap.image && (
                                        <img
                                            src={snap.image}
                                            alt=""
                                            className="w-10 h-12 object-cover rounded"
                                        />
                                    )}
                                </td>
                                <td className="py-2">
                                    <div>{snap.name ?? "Товар удалён"}</div>
                                    <div className="text-xs text-gray-400">
                                        Размер: {item.size}
                                    </div>
                                </td>
                                <td className="py-2 text-gray-500">×{item.quantity}</td>
                                <td className="py-2 text-right">
                                    €{(Number(item.price) * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                <div className="border-t mt-3 pt-3 text-sm grid gap-1">
                    <Row label="Доставка" value={`€${o.deliveryFee}`} />
                    <Row label="Итого" value={`€${o.totalAmount}`} strong />
                </div>
            </section>

            {/* Оплата */}
            {lastPayment && (
                <section className="border rounded-md p-4">
                    <div className="text-sm text-gray-600 mb-2">Оплата</div>
                    <div className="text-sm grid gap-1">
                        <Row
                            label="Способ"
                            value={lastPayment.paymentMethod ?? "—"}
                        />
                        <Row
                            label="Сумма"
                            value={`€${(lastPayment.amount / 100).toFixed(2)}`}
                        />
                        {lastPayment.refundedAmount > 0 && (
                            <Row
                                label="Возвращено"
                                value={`€${(lastPayment.refundedAmount / 100).toFixed(2)}`}
                            />
                        )}
                        {lastPayment.stripePaymentIntentId && (
                            <Row
                                label="Stripe"
                                value={lastPayment.stripePaymentIntentId}
                                mono
                            />
                        )}
                        {lastPayment.failureReason && (
                            <p className="text-red-600 text-xs mt-2">
                                {lastPayment.failureReason}
                            </p>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

function Row({
                 label,
                 value,
                 strong,
                 mono,
             }: {
    label: string;
    value: string;
    strong?: boolean;
    mono?: boolean;
}) {
    return (
        <div className="flex justify-between">
            <span className="text-gray-500">{label}</span>
            <span className={`${strong ? "font-medium" : ""} ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
        </div>
    );
}