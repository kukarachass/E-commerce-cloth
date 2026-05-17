import {ReactNode} from "react";
import Container from "@/components/layout/Сontainer";
import AccountNavigation from "@/components/account/AccountNavigation";
import TopBar from "@/components/layout/header/TopBar";
import MiddleBar from "@/components/layout/header/MiddleBar";
import Footer from "@/components/layout/footer/footer";

interface Props{
    children: ReactNode;
}

export default function AccountLayout({ children }: Props) {
    return (
        <div className="flex flex-col">
            <div className="pb-10">
                <TopBar />
                <MiddleBar />
            </div>
            <Container className="flex flex-col flex-1 min-h-screen">
                <div className="flex flex-row justify-between w-full gap-10 flex-1">
                    <AccountNavigation />
                    <div className="flex-1 pb-6">
                        {children}
                    </div>
                </div>
            </Container>
            <Footer />
        </div>
    )
}