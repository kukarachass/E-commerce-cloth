import {ReactNode} from "react";
import {getServerSession} from "@/lib/get-session";
import {redirect} from "next/navigation";

export default async function FavouritesLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession();
    if(!session) return redirect("/auth?method=sign-in");
    return(
        <>
            {children}
        </>
    )
}