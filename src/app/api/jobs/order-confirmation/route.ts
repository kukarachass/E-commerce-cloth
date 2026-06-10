// app/api/jobs/order-confirmation/route.ts
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { sendOrderConfirmationEmail } from "@/lib/email/orderConfirmation"

export const runtime = "nodejs"

async function handler(req: Request) {
    const { orderId } = (await req.json()) as { orderId: string }
    await sendOrderConfirmationEmail(orderId)
    return Response.json({ ok: true })
}

// verifySignatureAppRouter проверяет подпись QStash (по двум signing-ключам),
// чтобы роут не мог дёрнуть кто попало. Не прошло — он сам вернёт 401.
export const POST = verifySignatureAppRouter(handler)