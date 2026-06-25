// ✅ ТАК — гендер всегда точно совпадает с тем, что в URL
import { useParams } from "next/navigation";
export const GENDERS = ["women", "men"] as const   // ← подставь свои реальные значения
export type Gender = (typeof GENDERS)[number]

function isGender(value: string): value is Gender {
    return (GENDERS as readonly string[]).includes(value)
}

export function useGender() {
    const params = useParams();
    const raw = params?.gender;
    const gender = typeof raw === "string" && isGender(raw) ? raw : "men";
    return gender;
}