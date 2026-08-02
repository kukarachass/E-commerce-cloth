import "server-only";
import { and, count, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import { order, product, productSize, returnRequest } from "@/db/schema";

export type NavCounts = {
    toFulfill: number;
    openReturns: number;
    lowStock: number;
};

/**
 * Три числа для бейджей в навигации. Отдельный лёгкий запрос:
 * дашбордная сводка тянет ещё девять агрегатов, а они на каждой
 * странице админки не нужны.
 */
export async function getNavCounts(): Promise<NavCounts> {
    const [toFulfill, openReturns, lowStock] = await Promise.all([
        db
            .select({ n: count() })
            .from(order)
            .where(
                and(
                    eq(order.paymentStatus, "paid"),
                    eq(order.fulfillmentStatus, "unfulfilled"),
                ),
            ),

        db
            .select({ n: count() })
            .from(returnRequest)
            .where(eq(returnRequest.status, "open")),

        db
            .select({ n: count() })
            .from(productSize)
            .innerJoin(product, eq(productSize.productId, product.id))
            .where(and(eq(product.isActive, true), lte(productSize.stockAmount, 1))),
    ]);

    return {
        toFulfill: toFulfill[0].n,
        openReturns: openReturns[0].n,
        lowStock: lowStock[0].n,
    };
}
