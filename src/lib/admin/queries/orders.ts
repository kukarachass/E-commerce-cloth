import "server-only";
import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import { order, orderItem, user } from "@/db/schema";
import type { OrderFulfillmentStatus, OrderPaymentStatus } from "@/types/IOrder";

const PER_PAGE = 20;

export type OrderListParams = {
    page?: number;
    search?: string;
    payment?: OrderPaymentStatus;
    fulfillment?: OrderFulfillmentStatus;
};

export async function getOrderList({
                                       page = 1,
                                       search,
                                       payment,
                                       fulfillment,
                                   }: OrderListParams) {
    const conditions = [];

    if (search) conditions.push(ilike(order.email, `%${search}%`));
    if (payment) conditions.push(eq(order.paymentStatus, payment));
    if (fulfillment) conditions.push(eq(order.fulfillmentStatus, fulfillment));

    const where = conditions.length ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
        db
            .select({
                id: order.id,
                email: order.email,
                totalAmount: order.totalAmount,
                paymentStatus: order.paymentStatus,
                fulfillmentStatus: order.fulfillmentStatus,
                createdAt: order.createdAt,
                customerName: user.name,
                itemCount: sql<number>`(
                                           select coalesce(sum(${orderItem.quantity}), 0)
                                           from ${orderItem} where ${orderItem.orderId} = ${order.id}
                                       )`,
            })
            .from(order)
            .leftJoin(user, eq(order.userId, user.id))
            .where(where)
            .orderBy(desc(order.createdAt))
            .limit(PER_PAGE)
            .offset((page - 1) * PER_PAGE),

        db.select({ total: count() }).from(order).where(where),
    ]);

    return { rows, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}