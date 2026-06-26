// нет "use client", нет "use server" — просто утилита
export const GENDERS = ["men", "women"] as const;
export type Gender = (typeof GENDERS)[number];

export function isGender(value: string): value is Gender {
    return (GENDERS as readonly string[]).includes(value);
}