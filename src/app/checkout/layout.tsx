import Image from "next/image"
import Link from "next/link"
import LogoOnlyHeader from "@/components/layout/header/LogoOnlyHeader";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LogoOnlyHeader/>
            <main className="w-full">
                <div className="max-w-[1100px] mx-auto py-10">
                    {children}
                </div>
            </main>
        </>
    )
}