"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {updateBrand} from "@/lib/admin/actions/brand-actions/updateBrand";
import {createBrand} from "@/lib/admin/actions/brand-actions/createBrand";
import {BrandActionState} from "@/lib/admin/actions/brand-actions/types/BrandActionState";
import ImageUploader, {ImageRow} from "@/app/(admin)/admin/_components/images/ImageUploader";
import slugify from "@/lib/slugify";

export type BrandDefaults = {
    id: string;
    name: string;
    slug: string;
    description: string;
    promoDetailsText: string;
    imageUrl: string;
    tags: string[];
    isActive: boolean;
};

export default function BrandForm({
                                      mode,
                                      defaults,
                                  }: {
    mode: "create" | "edit";
    defaults?: BrandDefaults;
}) {
    const [state, formAction, pending] = useActionState<BrandActionState, FormData>(
        mode === "edit" ? updateBrand : createBrand,
        { ok: false },
    );

    const formRef = useRef<HTMLFormElement>(null);
    const [name, setName] = useState(defaults?.name ?? "");
    const [tags, setTags] = useState<string[]>(defaults?.tags ?? []);
    const [tagInput, setTagInput] = useState("");
    const [logo, setLogo] = useState<ImageRow[]>(
        defaults?.imageUrl ? [{ url: defaults.imageUrl, isMain: true }] : [],
    );

    useEffect(() => {
        if (!state.ok) return;
        toast.success(state.message ?? "Сохранено");
        if (mode === "create") {
            formRef.current?.reset();
            setName("");
            setTags([]);
            setLogo([]);
        }
    }, [state, mode]);

    const err = (f: string) => state.errors?.[f]?.[0];

    const addTag = () => {
        const v = tagInput.trim();
        if (v && !tags.includes(v)) setTags([...tags, v]);
        setTagInput("");
    };

    return (
        <form ref={formRef} action={formAction} className="max-w-2xl grid gap-4">
            {mode === "edit" && defaults && (
                <input type="hidden" name="id" value={defaults.id} />
            )}

            <Field label="Название" error={err("name")}>
                <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </Field>

            <Field label="Slug" error={err("slug")} hint="Пусто — сгенерируется из названия">
                <input
                    name="slug"
                    defaultValue={defaults?.slug ?? ""}
                    placeholder={slugify(name)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </Field>

            <Field label="Описание" error={err("description")}>
        <textarea
            name="description"
            rows={4}
            defaultValue={defaults?.description ?? ""}
            className="border rounded-md px-3 py-2 w-full"
        />
            </Field>

            <Field label="Промо-текст" error={err("promoDetailsText")} hint="Например: до -70%">
                <input
                    name="promoDetailsText"
                    defaultValue={defaults?.promoDetailsText ?? ""}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </Field>

            {/* Логотип: переиспользуем загрузчик, но берём только первый файл */}
            <div>
                <ImageUploader
                    images={logo}
                    onChange={(next) => setLogo(next.slice(-1))}
                    error={err("imageUrl")}
                />
                <input type="hidden" name="imageUrl" value={logo[0]?.url ?? ""} />
            </div>

            {/* Теги */}
            <div>
                <div className="text-sm text-gray-600 mb-1">Теги</div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((t) => (
                        <span
                            key={t}
                            className="px-2 py-1 bg-gray-100 rounded-md text-sm flex items-center gap-1"
                        >
              {t}
                            <button
                                type="button"
                                onClick={() => setTags(tags.filter((x) => x !== t))}
                                className="text-gray-400 hover:text-red-600"
                            >
                ✕
              </button>
            </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // иначе Enter отправит форму
                                addTag();
                            }
                        }}
                        placeholder="premium, sale…"
                        className="border rounded-md px-3 py-2 flex-1"
                    />
                    <button type="button" onClick={addTag} className="px-4 border rounded-md">
                        Добавить
                    </button>
                </div>
                <input type="hidden" name="tags" value={JSON.stringify(tags)} />
            </div>

            <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" defaultChecked={defaults?.isActive ?? true} />
                Активен
            </label>

            <button
                type="submit"
                disabled={pending}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50 justify-self-start"
            >
                {pending ? "Сохраняю…" : mode === "edit" ? "Сохранить" : "Создать бренд"}
            </button>
        </form>
    );
}

function Field({
                   label,
                   error,
                   hint,
                   children,
               }: {
    label: string;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="grid gap-1">
            <span className="text-sm text-gray-600">{label}</span>
            {children}
            {hint && !error && <span className="text-xs text-gray-400">{hint}</span>}
            {error && <span className="text-red-600 text-sm">{error}</span>}
        </label>
    );
}