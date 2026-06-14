import LogoOnlyHeader from "@/components/layout/header/LogoOnlyHeader";
import {ReactNode} from "react";
import Footer from "@/components/layout/footer/footer";

interface CheckoutLayoutProps{
    children: ReactNode;
}
export default function CheckoutLayout({ children }: CheckoutLayoutProps) {

    return (
        <>
            <LogoOnlyHeader/>
            <main className="w-full">
                <div className="max-w-[1100px] mx-auto py-10">
                    {children}
                </div>
            </main>
            <Footer/>
        </>
    )
}