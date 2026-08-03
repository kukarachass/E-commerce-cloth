import LogoOnlyHeader from "@/components/layout/header/LogoOnlyHeader"
import { ReactNode } from "react"
import Footer from "@/components/layout/footer/footer"

interface CheckoutLayoutProps {
    children: ReactNode
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
    return (
        <>
            <LogoOnlyHeader />
            <main className="w-full">
                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                    {children}
                </div>
            </main>
            <Footer />
        </>
    )
}