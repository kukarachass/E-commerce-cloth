"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { uploadProductImage } from "@/lib/admin/actions/media";

export type ImageRow = { url: string; isMain: boolean };

export default function ImageUploader({
                                          images,
                                          onChange,
                                          error,
                                      }: {
    images: ImageRow[];
    onChange: (next: ImageRow[]) => void;
    error?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [pending, start] = useTransition();
    const [dragging, setDragging] = useState(false);

    const upload = (files: FileList | null) => {
        if (!files?.length) return;

        start(async () => {
            const uploaded: ImageRow[] = [];

            for (const file of Array.from(files)) {
                const fd = new FormData();
                fd.append("file", file);
                const res = await uploadProductImage(fd);

                if (res.ok) {
                    uploaded.push({
                        url: res.url,
                        isMain: images.length === 0 && uploaded.length === 0,
                    });
                } else {
                    toast.error(`${file.name}: ${res.message}`);
                }
            }

            if (uploaded.length) {
                onChange([...images, ...uploaded]);
                toast.success(`Загружено: ${uploaded.length}`);
            }
            if (inputRef.current) inputRef.current.value = "";
        });
    };

    const remove = (i: number) => {
        const next = images.filter((_, j) => j !== i);
        // Если удалили главную — назначаем главной первую оставшуюся
        if (images[i].isMain && next.length) next[0].isMain = true;
        onChange(next);
    };

    const setMain = (i: number) =>
        onChange(images.map((img, j) => ({ ...img, isMain: j === i })));

    return (
        <div>
            <div className="mb-2 text-sm text-gray-600">Картинки</div>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                    {images.map((img, i) => (
                        <div
                            key={img.url}
                            className={
                                "relative w-24 h-32 rounded-md overflow-hidden border-2 " +
                                (img.isMain ? "border-black" : "border-transparent")
                            }
                        >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />

                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs leading-none"
                            >
                                ✕
                            </button>

                            {img.isMain ? (
                                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] text-center py-0.5">
                  главная
                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setMain(i)}
                                    className="absolute bottom-0 inset-x-0 bg-white/80 text-[10px] py-0.5 opacity-0 hover:opacity-100 transition"
                                >
                                    сделать главной
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    upload(e.dataTransfer.files);
                }}
                className={
                    "border-2 border-dashed rounded-md p-6 text-center cursor-pointer text-sm transition " +
                    (dragging ? "border-black bg-gray-50" : "border-gray-300") +
                    (pending ? " opacity-50 pointer-events-none" : "")
                }
            >
                {pending ? "Загружаю…" : "Перетащи файлы сюда или нажми для выбора"}
                <div className="text-xs text-gray-400 mt-1">
                    JPEG, PNG, WebP, AVIF · до 5 МБ
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                hidden
                onChange={(e) => upload(e.target.files)}
            />

            {/* На сервер уезжает тот же JSON, что и раньше — экшены менять не надо */}
            <input type="hidden" name="images" value={JSON.stringify(images)} />
        </div>
    );
}