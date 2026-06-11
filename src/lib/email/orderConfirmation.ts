// lib/email/orderConfirmation.ts
import "server-only"
import { Resend } from "resend"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { order } from "@/db/schema"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendOrderConfirmationEmail(orderId: string) {
    // 1. грузим заказ с позициями
    const ord = await db.query.order.findFirst({
        where: eq(order.id, orderId),
        with: { items: true },
    })
    if (!ord) throw new Error(`Order ${orderId} not found`) // throw → QStash повторит

    // 2. ИДЕМПОТЕНТНОСТЬ: уже слали — выходим
    if (ord.confirmationSentAt) return

    // 3. отправляем
    const { error } = await resend.emails.send({
        from: "Otrium <onboarding@resend.dev>",   // домен должен быть верифицирован в Resend
        to: ord.email,
        subject: "Ваш заказ подтверждён",
        html: renderConfirmationHtml(ord),
    })
    if (error) throw new Error(error.message)      // throw → QStash повторит позже

    // 4. помечаем, что письмо ушло
    await db.update(order)
        .set({ confirmationSentAt: new Date() })
        .where(eq(order.id, orderId))
}

// простой HTML-шаблон (позже можно заменить на React Email)
function renderConfirmationHtml(ord: { id: string; totalAmount: string; items: { quantity: number }[] }) {
    const count = ord.items.reduce((s, i) => s + i.quantity, 0)
    return `
        <h1>Спасибо за заказ!</h1>
        <p>Номер заказа: <b>${ord.id}</b></p>
        <p>Товаров: ${count}</p>
        <p>Сумма: €${ord.totalAmount}</p>
    `
}