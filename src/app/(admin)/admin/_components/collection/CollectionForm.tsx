"use client";

import {useActionState, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {updateBrand} from "@/lib/admin/actions/brand-actions/updateBrand";
import {createBrand} from "@/lib/admin/actions/brand-actions/createBrand";
import {BrandActionState} from "@/lib/admin/actions/brand-actions/types/BrandActionState";
import ImageUploader, {ImageRow} from "@/app/(admin)/admin/_components/images/ImageUploader";
import slugify from "@/lib/slugify";
import {FormActionState} from "@/lib/admin/admin-types/FormActionState";
import {updateCollection} from "@/lib/admin/actions/collection-actions/updateCollection";
import {createCollection} from "@/lib/admin/actions/collection-actions/createCollection";
import FormField from "@/app/(admin)/admin/_components/product-form/FormField";

export type CollectionDefaults = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    banner: string | null;
    gender: string;
    isActive: boolean;
};

export default function CollectionForm({
                                           mode,
                                           defaults,
                                       }: {
    mode: "create" | "edit";
    defaults?: CollectionDefaults;
}) {
    const [state, formAction, pending] = useActionState<FormActionState, FormData>(
        mode === "edit" ? updateCollection : createCollection,
        {ok: false},
    );

    const formRef = useRef<HTMLFormElement>(null);
    const [title, setTitle] = useState(defaults?.title ?? "");
    const [banner, setBanner] = useState<ImageRow[]>(
        defaults?.banner ? [{url: defaults.banner, isMain: true}] : [],
    );

    useEffect(() => {
        if (!state.ok) return;
        toast.success(state.message ?? "Сохранено");
        if (mode === "create") {
            formRef.current?.reset();
            setTitle("");
        }
    }, [state, mode]);

    useEffect(() => {
        console.log("action result:", state);
    }, [state]);

    const err = (f: string) => state.errors?.[f]?.[0];

    return (
        <form ref={formRef} action={formAction} className="max-w-2xl grid gap-4">
            {mode === "edit" && defaults && (
                <input type="hidden" name="id" value={defaults.id}/>
            )}
            {state.message && !state.ok && (
                <p className="text-red-600 text-sm">{state.message}</p>
            )}

            <Field label="Название" error={err("title")}>
                <input
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </Field>

            <Field label="Slug" error={err("slug")} hint="Пусто — сгенерируется из названия">
                <input
                    name="slug"
                    defaultValue={defaults?.slug ?? ""}
                    placeholder={slugify(title)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </Field>

            <FormField label="Пол" error={err("gender")}>
                <select
                    name="gender"
                    defaultValue={defaults?.gender ?? "women"}
                    className="border rounded-md px-3 py-2 w-full"
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                </select>
            </FormField>

            <Field label="Описание" error={err("description")}>
                <textarea
                    name="description"
                    rows={4}
                    defaultValue={defaults?.description ?? ""}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </Field>

            {/* Логотип: переиспользуем загрузчик, но берём только первый файл */}
            <div>
                <ImageUploader
                    images={banner}
                    onChange={(next) => setBanner(next.slice(-1))}
                    error={err("banner")}
                />
                <input type="hidden" name="imageUrl" value={banner[0]?.url ?? ""}/>
            </div>

            <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" defaultChecked={defaults?.isActive ?? true}/>
                Активен
            </label>

            <button
                type="submit"
                disabled={pending}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50 justify-self-start"
            >
                {pending ? "Сохраняю…" : mode === "edit" ? "Сохранить" : "Создать коллекцию"}
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