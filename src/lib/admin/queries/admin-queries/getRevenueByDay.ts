"use server"

import {db} from "@/db";
import {and, eq, gte, sql} from "drizzle-orm";
import {order} from "@/db/schema";
import startOfDay from "@/lib/admin/queries/admin-queries/helpers/startOfDay";
import toNum from "@/lib/admin/queries/admin-queries/helpers/toNum";

export async function getRevenueByDay(days = 14) {
    const from = startOfDay(days - 1);

    const rows = await db
        .select({
            day: sql<string>`to_char(${order.createdAt}, 'YYYY-MM-DD')`,
            revenue: sql<string | null>`sum(${order.totalAmount})`,
        })
        .from(order)
        .where(and(eq(order.paymentStatus, "paid"), gte(order.createdAt, from)))
        .groupBy(sql`to_char(${order.createdAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`to_char(${order.createdAt}, 'YYYY-MM-DD')`);

    // Дни без заказов в результат не попали — добиваем нулями,
    // иначе график соврёт о форме продаж
    const map = new Map(rows.map((r) => [r.day, toNum(r.revenue)]));
    const out: { day: string; revenue: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
        const d = startOfDay(i);
        const key = d.toISOString().slice(0, 10);
        out.push({ day: key, revenue: map.get(key) ?? 0 });
    }
    return out;
}