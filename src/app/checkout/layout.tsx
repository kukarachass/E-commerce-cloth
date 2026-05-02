import Image from "next/image"
import Link from "next/link"

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="sticky top-0 bg-white z-50 border-b border-gray-200">
                <div className="max-w-[1200px] sticky top-0 mx-auto py-4 flex justify-center">
                    <Link href="/">
                        <Image src="/logo.svg" alt="logo" width={100} height={24} />
                    </Link>
                </div>
            </header>
            <main className="w-full">
                <div className="max-w-[1100px] mx-auto py-10">
                    {children}
                </div>
            </main>
        </>
    )
}