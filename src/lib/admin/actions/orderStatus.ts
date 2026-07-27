"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { order, orderItem, productSize } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/rbac";
import { logAudit } from "@/lib/admin/audit";
import { canTransition, RESTOCK_ON } from "@/lib/admin/orders/transitions";
import type { OrderFulfillmentStatus } from "@/types/IOrder";

export type OrderActionState = { ok: boolean; message?: string };

export async function changeFulfillmentStatus(
    orderId: string,
    to: OrderFulfillmentStatus,
): Promise<OrderActionState> {
    const { session } = await requireAdmin();

    return db.transaction(async (tx) => {
        // Блокируем строку заказа: два админа не смогут одновременно
        // отменить и отправить один заказ
        const [current] = await tx
            .select({
                id: order.id,
                fulfillmentStatus: order.fulfillmentStatus,
                paymentStatus: order.paymentStatus,
            })
            .from(order)
            .where(eq(order.id, orderId))
            .for("update");

        if (!current) return { ok: false, message: "Заказ не найден" };

        // Проверка правил — на сервере, а не только по наличию кнопки
        const check = canTransition(
            current.fulfillmentStatus,
            to,
            current.paymentStatus,
        );
        if (!check.allowed) return { ok: false, message: check.reason };

        await tx
            .update(order)
            .set({ fulfillmentStatus: to })
            .where(eq(order.id, orderId));

        // Возврат товара на склад при отмене/возврате
        if (RESTOCK_ON.includes(to)) {
            const items = await tx
                .select({
                    productSizeId: orderItem.productSizeId,
                    quantity: orderItem.quantity,
                })
                .from(orderItem)
                .where(eq(orderItem.orderId, orderId));

            for (const item of items) {
                await tx
                    .update(productSize)
                    .set({
                        stockAmount: sql`${productSize.stockAmount} + ${item.quantity}`,
                    })
                    .where(eq(productSize.id, item.productSizeId));
            }
        }

        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: "update",
            entityType: "order",
            entityId: orderId,
            before: { fulfillmentStatus: current.fulfillmentStatus },
            after: { fulfillmentStatus: to },
        });

        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);

        return { ok: true, message: "Статус обновлён" };
    });
}