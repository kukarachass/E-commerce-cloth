"use server";

import { requireAdmin } from "@/lib/admin/rbac";
import { uploadImage } from "@/lib/admin/storage";

const MAX_BYTES = 5 * 1024 * 1024; // 5 МБ
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export type UploadResult =
    | { ok: true; url: string }
    | { ok: false; message: string };

export async function uploadProductImage(fd: FormData): Promise<UploadResult> {
    await requireAdmin();

    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) {
        return { ok: false, message: "Файл не выбран" };
    }

    // Проверяем на сервере, а не только в accept у input —
    // input можно обойти, экшен дёрнуть напрямую
    if (!ALLOWED.includes(file.type)) {
        return { ok: false, message: "Только JPEG, PNG, WebP или AVIF" };
    }
    if (file.size > MAX_BYTES) {
        return {
            ok: false,
            message: `Файл ${(file.size / 1024 / 1024).toFixed(1)} МБ, максимум 5 МБ`,
        };
    }

    try {
        const { url } = await uploadImage(file);
        return { ok: true, url };
    } catch (e) {
        return {
            ok: false,
            message: e instanceof Error ? e.message : "Ошибка загрузки",
        };
    }
}