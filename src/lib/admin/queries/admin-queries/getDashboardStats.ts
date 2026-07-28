"use server"

import startOfDay from "@/lib/admin/queries/admin-queries/helpers/startOfDay";
import {and, count, eq, gte, lte, sql} from "drizzle-orm";
import {order, product, productSize, returnRequest, user} from "@/db/schema";
import {db} from "@/db";
import toNum from "@/lib/admin/queries/admin-queries/helpers/toNum";

export async function getDashboardStats() {
    const today = startOfDay();
    const weekAgo = startOfDay(7);
    const monthAgo = startOfDay(30);
    const prevMonthStart = startOfDay(60);

    const [
        todayRow,
        weekRow,
        monthRow,
        prevMonthRow,
        pendingCount,
        toFulfillCount,
        openReturnsCount,
        lowStockCount,
        newCustomers,
    ] = await Promise.all([
        // Выручка и заказы за сегодня (только оплаченные)
        db
            .select({
                revenue: sql<string | null>`sum(${order.totalAmount})`,
                orders: count(),
            })
            .from(order)
            .where(and(eq(order.paymentStatus, "paid"), gte(order.createdAt, today))),

        db
            .select({
                revenue: sql<string | null>`sum(${order.totalAmount})`,
                orders: count(),
            })
            .from(order)
            .where(and(eq(order.paymentStatus, "paid"), gte(order.createdAt, weekAgo))),

        db
            .select({
                revenue: sql<string | null>`sum(${order.totalAmount})`,
                orders: count(),
            })
            .from(order)
            .where(and(eq(order.paymentStatus, "paid"), gte(order.createdAt, monthAgo))),

        // Предыдущие 30 дней — для сравнения "больше/меньше"
        db
            .select({ revenue: sql<string | null>`sum(${order.totalAmount})` })
            .from(order)
            .where(
                and(
                    eq(order.paymentStatus, "paid"),
                    gte(order.createdAt, prevMonthStart),
                    lte(order.createdAt, monthAgo),
                ),
            ),

        // Ждут оплаты
        db
            .select({ n: count() })
            .from(order)
            .where(eq(order.paymentStatus, "pending")),

        // Оплачены, но не собраны — вот это главная очередь работы
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

        // Размеры на исходе у активных товаров
        db
            .select({ n: count() })
            .from(productSize)
            .innerJoin(product, eq(productSize.productId, product.id))
            .where(and(eq(product.isActive, true), lte(productSize.stockAmount, 3))),

        db
            .select({ n: count() })
            .from(user)
            .where(gte(user.createdAt, monthAgo)),
    ]);

    const monthRevenue = toNum(monthRow[0].revenue);
    const prevRevenue = toNum(prevMonthRow[0].revenue);

    return {
        today: { revenue: toNum(todayRow[0].revenue), orders: todayRow[0].orders },
        week: { revenue: toNum(weekRow[0].revenue), orders: weekRow[0].orders },
        month: { revenue: monthRevenue, orders: monthRow[0].orders },
        revenueTrend:
            prevRevenue > 0
                ? Math.round(((monthRevenue - prevRevenue) / prevRevenue) * 100)
                : null,
        pendingPayment: pendingCount[0].n,
        toFulfill: toFulfillCount[0].n,
        openReturns: openReturnsCount[0].n,
        lowStock: lowStockCount[0].n,
        newCustomers: newCustomers[0].n,
    };
}