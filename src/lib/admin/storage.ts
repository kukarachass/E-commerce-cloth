import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service role key обходит все RLS-политики.
 * Живёт ТОЛЬКО здесь, на сервере. В браузер попасть не должен никогда —
 * поэтому "server-only" первой строкой.
 */
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
);

const BUCKET = "product-images";

export async function uploadImage(file: File, folder = "products") {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    // UUID в имени: два файла "photo.jpg" не затрут друг друга
    const path = `${folder}/${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path };
}

export async function deleteImageByUrl(url: string) {
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return; // не наш файл — например, старый внешний URL

    const path = url.slice(idx + marker.length);
    await supabase.storage.from(BUCKET).remove([path]);
}