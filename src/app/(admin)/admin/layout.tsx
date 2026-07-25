import {redirect} from "next/navigation";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {isAdmin} from "@/lib/admin/rbac";
import Link from "next/link";
import "@/app/(shop)/globals.css";


export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) redirect("/login");        // не залогинен → на обычный вход сайта
    if (!(await isAdmin())) redirect("/");   // залогинен, но не админ → на витрину

    return (
        <html lang="en" className={`h-full antialiased`}>
        <body className={`min-h-screen flex`}>
        <aside className="w-[240px] p-4 border-r border-[#eee]">
            <div className="mb-4 font-normal">extropy admin</div>
            <nav className="grid gap-8">
                <a href="/admin">Дашборд</a>
                <a href="/admin/products">Товары</a>
                <a href="/admin/orders">Заказы</a>
            </nav>
            <Link href={"/women"}>
                Back to store
            </Link>
        </aside>
        <main className="flex p-6">{children}</main>
        </body>
        </html>
    );
}