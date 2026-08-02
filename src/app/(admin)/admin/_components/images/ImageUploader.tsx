"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { uploadProductImage } from "@/lib/admin/actions/media";
import cn from "@/app/(admin)/admin/_lib/cn";

export type ImageRow = { url: string; isMain: boolean };

/**
 * Загрузка картинок с превью и выбором главной.
 *
 * `name` управляет скрытым полем формы: товару нужен массив images,
 * бренду и коллекции — одна ссылка под своим именем, поэтому там
 * передают null и кладут своё поле рядом.
 */
export default function ImageUploader({
    images,
    onChange,
    error,
    name = "images",
    label = "Images",
    hint = "JPEG, PNG, WebP, AVIF · up to 5 MB",
    single,
}: {
    images: ImageRow[];
    onChange: (next: ImageRow[]) => void;
    error?: string;
    name?: string | null;
    label?: string;
    hint?: string;
    /** режим одной картинки: логотип, баннер */
    single?: boolean;
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
                toast.success(
                    `Uploaded ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`,
                );
            }
            if (inputRef.current) inputRef.current.value = "";
        });
    };

    const remove = (index: number) => {
        const next = images.filter((_, i) => i !== index);
        // сняли главную — назначаем главной первую оставшуюся
        if (images[index].isMain && next.length) next[0] = { ...next[0], isMain: true };
        onChange(next);
    };

    const setMain = (index: number) =>
        onChange(images.map((img, i) => ({ ...img, isMain: i === index })));

    return (
        <div className="grid grid-cols-1 gap-2">
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-medium text-ink-soft">{label}</span>
                {images.length > 0 && !single && (
                    <span className="tnum text-[11px] text-ink-faint">
                        {images.length} uploaded
                    </span>
                )}
            </div>

            {error && <p className="text-xs text-critical">{error}</p>}

            {images.length > 0 && (
                <ul className="flex flex-wrap gap-2.5">
                    {images.map((img, i) => (
                        <li
                            key={img.url}
                            className={cn(
                                "group relative h-32 w-24 overflow-hidden rounded-field bg-sunk",
                                img.isMain && !single
                                    ? "ring-2 ring-accent"
                                    : "ring-1 ring-line-strong",
                            )}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={img.url}
                                alt=""
                                className="h-full w-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => remove(i)}
                                aria-label="Remove image"
                                className="absolute top-1.5 right-1.5 grid grid-cols-1 h-6 w-6 place-items-center rounded-full bg-ink/65 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>

                            {!single &&
                                (img.isMain ? (
                                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-accent py-1 text-[10px] font-semibold text-white">
                                        <Star className="h-3 w-3 fill-current" />
                                        Main
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setMain(i)}
                                        className="absolute inset-x-0 bottom-0 bg-card/90 py-1 text-[10px] font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        Set as main
                                    </button>
                                ))}
                        </li>
                    ))}
                </ul>
            )}

            <button
                type="button"
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
                disabled={pending}
                className={cn(
                    "flex flex-col items-center justify-center gap-1.5 rounded-field border-2 border-dashed px-4 py-6 text-center transition-colors",
                    dragging
                        ? "border-accent bg-accent-soft"
                        : "border-line-strong hover:border-ink/25 hover:bg-sunk/60",
                    pending && "pointer-events-none opacity-60",
                )}
            >
                {pending ? (
                    <Loader2 className="h-5 w-5 animate-spin text-ink-faint" />
                ) : (
                    <ImagePlus className="h-5 w-5 text-ink-faint" strokeWidth={1.7} />
                )}
                <span className="text-sm font-medium text-ink">
                    {pending ? "Uploading…" : "Drop files or click to upload"}
                </span>
                <span className="text-xs text-ink-faint">{hint}</span>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple={!single}
                hidden
                onChange={(e) => upload(e.target.files)}
            />

            {name && (
                <input type="hidden" name={name} value={JSON.stringify(images)} />
            )}
        </div>
    );
}
