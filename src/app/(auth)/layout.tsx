import LogoOnlyHeader from "@/components/layout/header/LogoOnlyHeader";
import Container from "@/components/layout/Сontainer";
import Footer from "@/components/layout/footer/footer";
import TopBar from "@/components/layout/header/TopBar";
import AuthMethodSwitcher from "@/components/auth/AuthMethodSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }){
    return(
        <>
            <TopBar/>
            <LogoOnlyHeader/>
            <main className="flex flex-col w-full">
                <Container className="py-[64px] min-h-[80vh]">
                    {children}
                </Container>
            </main>
            <Footer/>
        </>
    )
}