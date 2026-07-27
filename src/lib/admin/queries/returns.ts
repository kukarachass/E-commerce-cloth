import "server-only";
import {count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { returnRequest, returnItem, order, user } from "@/db/schema";

const PER_PAGE = 20;

export async function getReturnList({
                                        page = 1,
                                        status,
                                    }: {
    page?: number;
    status?: "open" | "closed";
}) {
    const where = status ? eq(returnRequest.status, status) : undefined;

    const [rows, [{ total }]] = await Promise.all([
        db
            .select({
                id: returnRequest.id,
                orderId: returnRequest.orderId,
                status: returnRequest.status,
                refundedAmount: returnRequest.refundedAmount,
                createdAt: returnRequest.createdAt,
                customerName: user.name,
                email: order.email,
                itemCount: count(returnItem.id),
            })
            .from(returnRequest)
            .leftJoin(order, eq(returnRequest.orderId, order.id))
            .leftJoin(user, eq(returnRequest.userId, user.id))
            .leftJoin(returnItem, eq(returnItem.returnRequestId, returnRequest.id))
            .where(where)
            .groupBy(returnRequest.id, user.name, order.email)
            .orderBy(desc(returnRequest.createdAt))
            .limit(PER_PAGE)
            .offset((page - 1) * PER_PAGE),

        db.select({ total: count() }).from(returnRequest).where(where),
    ]);

    return { rows, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}

export async function getReturnDetail(id: string) {
    const row = await db.query.returnRequest.findFirst({
        where: eq(returnRequest.id, id),
        with: {
            user: { columns: { id: true, name: true, email: true } },
            order: {
                columns: { id: true, email: true, totalAmount: true, paymentStatus: true },
                with: { payments: true },
            },
            items: {
                with: {
                    orderItem: {
                        columns: {
                            id: true,
                            size: true,
                            quantity: true,
                            price: true,
                            productSnapshot: true,
                            productSizeId: true,
                        },
                    },
                },
            },
        },
    });
    return row ?? null;
}