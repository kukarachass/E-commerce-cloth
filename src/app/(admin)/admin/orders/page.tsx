import Link from "next/link";
import { requireAdmin } from "@/lib/admin/rbac";
import { getOrderList } from "@/lib/admin/queries/orders";
import { orderPaymentStatusEnum, orderFulfillmentStatusEnum } from "@/db/schema";
import {
    parseEnumParam,
    type OrderFulfillmentStatus,
    type OrderPaymentStatus,
} from "@/types/IOrder";

/** Record без "?" — TS не даст собраться, если появится новый статус без перевода */
const PAYMENT_LABELS: Record<OrderPaymentStatus, string> = {
    pending: "Ожидает оплаты",
    paid: "Оплачен",
    failed: "Ошибка оплаты",
    expired: "Истёк",
    refunded: "Возвращён",
    partially_refunded: "Частичный возврат",
};

const FULFILLMENT_LABELS: Record<OrderFulfillmentStatus, string> = {
    unfulfilled: "Не собран",
    processing: "Собирается",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён",
    returned: "Возвращён",
};

const PAYMENT_COLOR: Record<OrderPaymentStatus, string> = {
    pending: "text-amber-600",
    paid: "text-green-600",
    failed: "text-red-600",
    expired: "text-gray-400",
    refunded: "text-gray-500",
    partially_refunded: "text-gray-500",
};

const dateFmt = new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function OrdersPage({
                                             searchParams,
                                         }: {
    searchParams: Promise<SearchParams>;
}) {
    await requireAdmin();

    const sp = await searchParams;

    const search = first(sp.search);
    const payment = parseEnumParam(sp.payment, orderPaymentStatusEnum.enumValues);
    const fulfillment = parseEnumParam(
        sp.fulfillment,
        orderFulfillmentStatusEnum.enumValues,
    );

    const { rows, total, page, totalPages } = await getOrderList({
        page: Number(first(sp.page)) || 1,
        search,
        payment,
        fulfillment,
    });

    return (
        <div className="w-full">
            <h1 className="text-xl mb-6">
                Заказы <span className="text-gray-400">({total})</span>
            </h1>

            <form className="flex gap-2 mb-4">
                <input
                    name="search"
                    defaultValue={search ?? ""}
                    placeholder="Поиск по email"
                    className="border rounded-md px-3 py-2 flex-1"
                />

                <select
                    name="payment"
                    defaultValue={payment ?? "all"}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="all">Оплата: все</option>
                    {orderPaymentStatusEnum.enumValues.map((v) => (
                        <option key={v} value={v}>
                            {PAYMENT_LABELS[v]}
                        </option>
                    ))}
                </select>

                <select
                    name="fulfillment"
                    defaultValue={fulfillment ?? "all"}
                    className="border rounded-md px-3 py-2"
                >
                    <option value="all">Доставка: все</option>
                    {orderFulfillmentStatusEnum.enumValues.map((v) => (
                        <option key={v} value={v}>
                            {FULFILLMENT_LABELS[v]}
                        </option>
                    ))}
                </select>

                <button className="px-4 py-2 border rounded-md">Найти</button>
            </form>

            <table className="w-full text-left text-sm">
                <thead className="text-gray-500 border-b">
                <tr>
                    <th className="py-2 font-normal">Заказ</th>
                    <th className="py-2 font-normal">Клиент</th>
                    <th className="py-2 font-normal">Позиций</th>
                    <th className="py-2 font-normal">Сумма</th>
                    <th className="py-2 font-normal">Оплата</th>
                    <th className="py-2 font-normal">Доставка</th>
                    <th className="py-2 font-normal">Дата</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((o) => (
                    <tr key={o.id} className="border-b hover:bg-gray-50">
                        <td className="py-2">
                            <Link
                                href={`/admin/orders/${o.id}`}
                                className="text-blue-600 font-mono"
                            >
                                #{o.id.slice(0, 8)}
                            </Link>
                        </td>
                        <td className="py-2">
                            <div>{o.customerName ?? "Гость"}</div>
                            <div className="text-gray-400 text-xs">{o.email}</div>
                        </td>
                        <td className="py-2">{o.itemCount}</td>
                        <td className="py-2">€{o.totalAmount}</td>
                        <td className={`py-2 ${PAYMENT_COLOR[o.paymentStatus]}`}>
                            {PAYMENT_LABELS[o.paymentStatus]}
                        </td>
                        <td className="py-2">
                            {FULFILLMENT_LABELS[o.fulfillmentStatus]}
                        </td>
                        <td className="py-2 text-gray-500">
                            {dateFmt.format(o.createdAt)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {rows.length === 0 && (
                <p className="text-gray-500 py-8 text-center">Заказов не найдено</p>
            )}

            {totalPages > 1 && (
                <div className="flex gap-2 mt-6 items-center">
                    {page > 1 && (
                        <Link
                            href={buildUrl({ search, payment, fulfillment }, page - 1)}
                            className="px-3 py-1 border rounded-md"
                        >
                            Назад
                        </Link>
                    )}
                    <span className="text-gray-500 text-sm">
            Страница {page} из {totalPages}
          </span>
                    {page < totalPages && (
                        <Link
                            href={buildUrl({ search, payment, fulfillment }, page + 1)}
                            className="px-3 py-1 border rounded-md"
                        >
                            Вперёд
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

/** searchParams может отдать массив, если ключ повторился в URL */
function first(v: string | string[] | undefined): string | undefined {
    return Array.isArray(v) ? v[0] : v;
}

function buildUrl(
    filters: {
        search?: string;
        payment?: OrderPaymentStatus;
        fulfillment?: OrderFulfillmentStatus;
    },
    page: number,
) {
    const p = new URLSearchParams();
    if (filters.search) p.set("search", filters.search);
    if (filters.payment) p.set("payment", filters.payment);
    if (filters.fulfillment) p.set("fulfillment", filters.fulfillment);
    p.set("page", String(page));
    return `/admin/orders?${p}`;
}