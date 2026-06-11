// app/order/success/page.tsx  (серверный компонент)
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { order } from "@/db/schema"
import { auth } from "@/lib/auth"

export default async function SuccessPage({
                                              searchParams,
                                          }: { searchParams: Promise<{ id?: string }> }) {
    const { id } = await searchParams
    if (!id) notFound()

    const ord = await db.query.order.findFirst({ where: eq(order.id, id) })
    if (!ord) notFound()

    // ВЛАДЕНИЕ: чужой заказ не показываем
    const session = await auth.api.getSession({ headers: await headers() })
    if (ord.userId && ord.userId !== session?.user.id) notFound()

    // НЕ подтверждаем оплату тут! Только ЧИТАЕМ статус, который выставил вебхук.
    if (ord.paymentStatus === "paid") {
        return <h1>Спасибо! Заказ {ord.id} оплачен 🎉</h1>
    }

    // вебхук мог ещё не дойти — это нормально, не паникуем
    return (
        <div>
            <h1>Оплата обрабатывается…</h1>
            <p>Мы пришлём подтверждение на почту, как только всё подтвердится.</p>
        </div>
    )
}