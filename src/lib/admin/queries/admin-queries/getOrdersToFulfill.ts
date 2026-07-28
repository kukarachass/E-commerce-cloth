import {db} from "@/db";
import {order, user} from "@/db/schema";
import {and, eq} from "drizzle-orm";

export async function getOrdersToFulfill(limit = 8) {
    return db
        .select({
            id: order.id,
            email: order.email,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            customerName: user.name,
        })
        .from(order)
        .leftJoin(user, eq(order.userId, user.id))
        .where(
            and(
                eq(order.paymentStatus, "paid"),
                eq(order.fulfillmentStatus, "unfulfilled"),
            ),
        )
        .orderBy(order.createdAt) // самые старые первыми — они ждут дольше
        .limit(limit);
}