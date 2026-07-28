"use server"

import {db} from "@/db";
import {order, orderItem, product} from "@/db/schema";
import {and, desc, eq, gte, sql} from "drizzle-orm";
import startOfDay from "@/lib/admin/queries/admin-queries/helpers/startOfDay";

export async function getTopProducts(limit = 5) {
    return db
        .select({
            productId: orderItem.productId,
            name: product.name,
            sold: sql<number>`sum(${orderItem.quantity})::int`,
            revenue: sql<string | null>`sum(${orderItem.price} * ${orderItem.quantity})`,
        })
        .from(orderItem)
        .innerJoin(order, eq(orderItem.orderId, order.id))
        .innerJoin(product, eq(orderItem.productId, product.id))
        .where(
            and(eq(order.paymentStatus, "paid"), gte(order.createdAt, startOfDay(30))),
        )
        .groupBy(orderItem.productId, product.name)
        .orderBy(desc(sql`sum(${orderItem.quantity})`))
        .limit(limit);
}