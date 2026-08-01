import { notFound } from "next/navigation";

const GENDERS = ["women", "men"] as const;
export type Gender = (typeof GENDERS)[number];

export function isGender(v: string): v is Gender {
    return (GENDERS as readonly string[]).includes(v);
}

export default async function GenderLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ gender: string }>;
}) {
    const { gender } = await params;

    // Любой сегмент, кроме women/men — не наш роут
    if (!isGender(gender)) notFound();

    return <>{children}</>;
}