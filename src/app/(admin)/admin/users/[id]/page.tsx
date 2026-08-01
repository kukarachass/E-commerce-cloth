import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import getUserById from "@/lib/admin/queries/users-queries/getUserById";
import Link from "next/link";
import UserActions from "@/app/(admin)/admin/_components/users/UsersActions";

export default async function UserPage(
    { params }: { params: Promise<{ id: string }> }
) {
    await requireAdmin();
    const { id } = await params;

    const user = await getUserById(id);
    if (!user) return notFound();

    return (
        <div className="p-6 space-y-8">
            {/* ИНФО О ЮЗЕРЕ */}
            <div>
                <h1 className="text-lg font-semibold">
                    {user.name} {user.lastName ?? ""}
                </h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                    <p>Телефон: {user.phoneNumber ?? "—"}</p>
                    <p>Пол: {user.gender ?? "—"}</p>
                    <p>Роль: {user.role}</p>
                    <p>Email подтверждён: {user.emailVerified ? "да" : "нет"}</p>
                    <p>Регистрация: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                {user.banned && (
                    <p className="text-red-600 text-sm mt-2">
                        Заблокирован: {user.banReason ?? "без причины"}
                        {user.banExpires
                            ? ` (до ${new Date(user.banExpires).toLocaleDateString()})`
                            : " (бессрочно)"}
                    </p>
                )}
            </div>

            <UserActions
                userId={user.id}
                isBanned={!!user.banned}
                role={user.role}
                emailVerified={user.emailVerified}
            />

            {/* активные сессии */}
            <div>
                <h2 className="font-semibold mb-2">Сессии ({user.sessions.length})</h2>
                {user.sessions.length === 0 ? (
                    <p className="text-gray-400 text-sm">Активных сессий нет</p>
                ) : (
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="py-2 px-3 text-left">IP</th>
                            <th className="py-2 px-3 text-left">Устройство</th>
                            <th className="py-2 px-3 text-left">Истекает</th>
                        </tr>
                        </thead>
                        <tbody>
                        {user.sessions.map((s) => (
                            <tr key={s.id} className="border-b">
                                <td className="py-2 px-3">{s.ipAddress ?? "—"}</td>
                                <td className="py-2 px-3 truncate max-w-xs">{s.userAgent ?? "—"}</td>
                                <td className="py-2 px-3">{new Date(s.expiresAt).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* КОРЗИНА */}
            <div>
                <h2 className="font-semibold mb-2">Корзина</h2>
                {!user.cart || user.cart.items.length === 0 ? (
                    <p className="text-gray-400 text-sm">Корзина пуста</p>
                ) : (
                    <>
                        <table className="w-full text-sm border">
                            <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="py-2 px-3 text-left">Товар</th>
                                <th className="py-2 px-3 text-left">Размер</th>
                                <th className="py-2 px-3 text-left">Кол-во</th>
                                <th className="py-2 px-3 text-left">Цена</th>
                            </tr>
                            </thead>
                            <tbody>
                            {user.cart.items.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="py-2 px-3">{item.product?.name ?? "—"}</td>
                                    <td className="py-2 px-3">{item.productSize?.size ?? "—"}</td>
                                    <td className="py-2 px-3">{item.quantity}</td>
                                    <td className="py-2 px-3">€{item.priceAtAddition}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <p className="text-sm text-gray-500 mt-2">
                            Итого: €{user.cart.totalAmount} · К оплате: €{user.cart.grandTotal}
                        </p>
                    </>
                )}
            </div>

            {/* ЗАКАЗЫ */}
            <div>
                <h2 className="font-semibold mb-2">Заказы ({user.orders.length})</h2>
                {user.orders.length === 0 ? (
                    <p className="text-gray-400 text-sm">Заказов нет</p>
                ) : (
                    <div className="space-y-4">
                        {user.orders.map((order) => (
                            <div key={order.id} className="border rounded-md p-3">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>
                                        Заказ #{order.id.slice(0, 8)} · {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    <span>{order.paymentStatus} / {order.fulfillmentStatus}</span>
                                </div>
                                <Link className="bg-black p-1 rounded-[4px] text-white" href={`/orders/${order.id}`}>Перейти к заказу</Link>
                                <table className="w-full text-sm">
                                    <tbody>
                                    {order.items.map((item) => {
                                        const snapshot = item.productSnapshot as { name?: string };
                                        return (
                                            <tr key={item.id} className="border-b last:border-0">
                                                <td className="py-1">{snapshot?.name ?? "товар удалён"}</td>
                                                <td className="py-1">{item.size}</td>
                                                <td className="py-1">x{item.quantity}</td>
                                                <td className="py-1">€{item.price}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                                <p className="text-sm text-gray-500 mt-2">Итого: €{order.totalAmount}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}