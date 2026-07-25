import { ReactNode } from "react"
import Container from "@/components/layout/Сontainer"
import AccountNavigation from "@/components/account/AccountNavigation"
import TopBar from "@/components/layout/header/TopBar"
import MiddleBar from "@/components/layout/header/MiddleBar"
import Footer from "@/components/layout/footer/footer"
import { getServerSession } from "@/lib/get-session"
import { redirect } from "next/navigation"

interface Props {
    children: ReactNode
}

export default async function AccountLayout({ children }: Props) {
    const session = await getServerSession()
    if (!session) return redirect("/auth?method=sign-in")

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <MiddleBar className="border-b border-gray-200" />

            {/* Mobile: nav прилипает под MiddleBar */}
            <div className="md:hidden sticky top-[57px] z-30 bg-white border-b border-neutral-100">
                <AccountNavigation />
            </div>

            <Container className="flex-1 py-6 md:py-10">
                <div className="flex flex-col md:flex-row md:gap-10 w-full">

                    {/* Desktop: sidebar */}
                    <aside className="hidden md:block shrink-0">
                        <AccountNavigation />
                    </aside>

                    {/* Контент */}
                    <main className="flex-1 min-w-0 pb-6">
                        {children}
                    </main>

                </div>
            </Container>

            <Footer />
        </div>
    )
}