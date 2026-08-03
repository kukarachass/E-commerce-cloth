import "server-only";
import { count, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { order } from "@/db/schema";
import startOfDay from "@/lib/admin/queries/admin-queries/helpers/startOfDay";
import type { OrderFulfillmentStatus } from "@/types/IOrder";

export type OrderMixRow = {
    status: OrderFulfillmentStatus;
    orders: number;
    revenue: number;
};

/**
 * Распределение заказов по стадии доставки за период.
 * Нужно, чтобы на дашборде было видно не только «сколько денег»,
 * но и «где сейчас застряла работа».
 */
export async function getOrderMix(days = 30): Promise<OrderMixRow[]> {
    const rows = await db
        .select({
            status: order.fulfillmentStatus,
            orders: count(),
            revenue: sql<string | null>`sum(${order.totalAmount})`,
        })
        .from(order)
        .where(gte(order.createdAt, startOfDay(days)))
        .groupBy(order.fulfillmentStatus);

    return rows.map((r) => ({
        status: r.status,
        orders: r.orders,
        revenue: r.revenue ? Number(r.revenue) : 0,
    }));
}
