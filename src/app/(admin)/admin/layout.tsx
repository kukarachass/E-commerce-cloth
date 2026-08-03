import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/admin/rbac";
import { getNavCounts } from "@/lib/admin/queries/admin-queries/getNavCounts";
import AdminShell from "@/app/(admin)/admin/_components/shell/AdminShell";
import "./admin.css";

const adminSans = Plus_Jakarta_Sans({
    variable: "--font-admin-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Extropy · Admin",
    description: "Store operations console",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) redirect("/auth?method=sign-up");
    if (!(await isAdmin())) redirect("/");

    const counts = await getNavCounts();

    return (
        <html lang="en" className={`${adminSans.variable} h-full antialiased`}>
            <body className="min-h-dvh bg-canvas font-sans text-ink">
                <AdminShell
                    counts={counts}
                    user={{
                        name: session.user.name,
                        email: session.user.email,
                        image: session.user.image,
                    }}
                >
                    {children}
                </AdminShell>

                <Toaster
                    position="bottom-center"
                    theme="light"
                    toastOptions={{
                        style: {
                            borderRadius: "16px",
                            border: "1px solid #ece9e6",
                        },
                    }}
                />
            </body>
        </html>
    );
}
