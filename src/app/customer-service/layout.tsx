import {ReactNode} from "react";
import Container from "@/components/layout/Сontainer";
import Footer from "@/components/layout/footer/footer";
import LogoOnlyHeader from "@/components/layout/header/LogoOnlyHeader";

export default function CustomerServiceLayout({children}: { children: ReactNode }) {
    return (
        <>
            <LogoOnlyHeader/>
            <Container className="py-10">
                {children}
            </Container>
            <Footer/>
        </>
    )
}