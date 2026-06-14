import {notFound} from "next/navigation";
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {order} from "@/db/schema";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import SuccessPaidPage from "@/components/checkout/SuccessPaidPage";
import LogoOnlyHeader from "@/components/layout/header/LogoOnlyHeader";
import Footer from "@/components/layout/footer/footer";

export default async function CheckoutStep3({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const { id } = await searchParams
    if (!id) notFound()

    const ord = await db.query.order.findFirst({ where: eq(order.id, id) })
    if (!ord) notFound()

    // ВЛАДЕНИЕ: чужой заказ не показываем
    const session = await auth.api.getSession({ headers: await headers() })
    if (ord.userId && ord.userId !== session?.user.id) notFound()

    // НЕ подтверждаем оплату тут! Только ЧИТАЕМ статус, который выставил вебхук.
    if (ord.paymentStatus === "paid") {
        return <SuccessPaidPage order={ord}/>
    }

    // вебхук мог ещё не дойти — это нормально, не паникуем
    return (
        <>
            <LogoOnlyHeader/>
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-6 max-w-[420px] w-full text-center">
                    {/* Spinner */}
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-[3px] border-[#f0f0f0]"/>
                        <div className="absolute inset-0 rounded-full border-[3px] border-t-[var(--text)] animate-spin"/>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-[var(--text)] text-[24px] font-bold leading-[133%]">
                            Processing your payment
                        </h1>
                        <p className="text-[#999] text-[15px] leading-[160%]">
                            Please don't close this page. We'll send a confirmation to your email once everything is confirmed.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 w-full bg-[#f9f9f9] rounded-[12px] p-4">
                        {["Payment verification", "Reserving your items", "Sending confirmation"].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full border-[2px] border-[#e0e0e0] flex items-center justify-center shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#ccc] animate-pulse" style={{ animationDelay: `${i * 300}ms` }}/>
                                </div>
                                <span className="text-[13px] text-[#999]">{step}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-[12px] text-[#bbb]">
                        This usually takes less than a minute
                    </p>
                </div>
            </div>
            <Footer/>
        </>
    )
}