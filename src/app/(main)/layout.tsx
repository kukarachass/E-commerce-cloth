import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";


export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </>
    )
}
