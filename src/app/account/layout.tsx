import {ReactNode} from "react";
import Container from "@/components/layout/Сontainer";
import AccountNavigation from "@/components/account/AccountNavigation";
import TopBar from "@/components/layout/header/TopBar";
import MiddleBar from "@/components/layout/header/MiddleBar";
import Footer from "@/components/layout/footer/footer";
import {getServerSession} from "@/lib/get-session";
import {redirect} from "next/navigation";

interface Props{
    children: ReactNode;
}

export default async function AccountLayout({ children }: Props) {
    const session = await getServerSession();
    if(!session) return redirect("/auth?method=sign-in");

    return (
        <div className="flex flex-col">
            <div className="pb-10">
                <TopBar />
                <MiddleBar className="border-b border-gray-200"/>
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