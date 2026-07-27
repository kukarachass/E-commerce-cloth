"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CategoryGroup } from "@/lib/admin/queries/categories";
import { updateProduct } from "@/lib/admin/actions/productUpdate";
import { createProduct, type ActionState } from "@/lib/admin/actions/createProduct";
import slugify from "@/lib/slugify";
import FormField from "@/app/(admin)/admin/_components/product-form/FormField";
import ImagesFormSection from "@/app/(admin)/admin/_components/product-form/ImagesFormSection";
import SizeFormSection from "@/app/(admin)/admin/_components/product-form/SizeFormSection";

type Option = { id: string; name: string };
export type SizeRow = { size: string; sizeSystem: string; stockAmount: number };
export type ImageRow = { url: string; isMain: boolean };
type Mode = "create" | "edit";

/** Значения для режима редактирования. В режиме создания не передаются. */
export type ProductFormDefaults = {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: string;
    oldPrice: string;
    material: string;
    careInstructions: string;
    gender: string;
    brandId: string;
    categoryId: string;
    isActive: boolean;
    sizes: SizeRow[];
    images: ImageRow[];
};

interface ProductFormProps {
    brands: Option[];
    categoryGroups: CategoryGroup[];
    mode: Mode;
    defaults?: ProductFormDefaults;
}



const emptySize: SizeRow = { size: "", sizeSystem: "EU", stockAmount: 0 };

export default function ProductForm({
                                        brands,
                                        categoryGroups,
                                        mode,
                                        defaults,
                                    }: ProductFormProps) {
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        mode === "edit" ? updateProduct : createProduct,
        { ok: false },
    );

    const formRef = useRef<HTMLFormElement>(null);

    const [sizes, setSizes] = useState<SizeRow[]>(
        defaults?.sizes?.length ? defaults.sizes : [emptySize],
    );
    const [images, setImages] = useState<ImageRow[]>(defaults?.images ?? []);
    const [name, setName] = useState(defaults?.name ?? "");

    useEffect(() => {
        if (!state.ok) return;
        toast.success(state.message ?? "Сохранено");
        // Очищаем форму только при создании. При редактировании
        // человек остаётся на том же товаре и продолжает работать.
        if (mode === "create") {
            formRef.current?.reset();
            setSizes([emptySize]);
            setImages([]);
            setName("");
        }
    }, [state, mode]);

    const err = (f: string) => state.errors?.[f]?.[0];

    return (
        <form ref={formRef} action={formAction} className="max-w-2xl grid gap-4">
            {mode === "edit" && defaults && (
                <input type="hidden" name="id" value={defaults.id} />
            )}

            {state.message && !state.ok && (
                <p className="text-red-600 text-sm">{state.message}</p>
            )}

            <FormField label="Название" error={err("name")}>
                <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </FormField>

            <FormField
                label="Slug"
                error={err("slug")}
                hint="Оставь пустым — сгенерируется из названия"
            >
                <input
                    name="slug"
                    defaultValue={defaults?.slug ?? ""}
                    placeholder={slugify(name)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Цена" error={err("price")}>
                    <input
                        name="price"
                        defaultValue={defaults?.price ?? ""}
                        placeholder="49.99"
                        inputMode="decimal"
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </FormField>
                <FormField
                    label="Старая цена"
                    error={err("oldPrice")}
                    hint="Только если есть скидка"
                >
                    <input
                        name="oldPrice"
                        defaultValue={defaults?.oldPrice ?? ""}
                        placeholder="99.99"
                        inputMode="decimal"
                        className="border rounded-md px-3 py-2 w-full"
                    />
                </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
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

                <FormField label="Бренд" error={err("brandId")}>
                    <select
                        name="brandId"
                        defaultValue={defaults?.brandId ?? ""}
                        className="border rounded-md px-3 py-2 w-full"
                    >
                        <option value="">—</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </FormField>

                <FormField label="Категория" error={err("categoryId")}>
                    <select
                        name="categoryId"
                        defaultValue={defaults?.categoryId ?? ""}
                        className="border rounded-md px-3 py-2 w-full"
                    >
                        <option value="">— выберите —</option>
                        {categoryGroups.map((g) => (
                            <optgroup key={g.gender} label={g.label}>
                                {g.items.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {"\u00A0".repeat((c.level - 1) * 3)}
                                        {c.level > 1 ? "└ " : ""}
                                        {c.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </FormField>
            </div>

            <FormField label="Материал" error={err("material")}>
                <input
                    name="material"
                    defaultValue={defaults?.material ?? ""}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </FormField>

            <FormField label="Уход" error={err("careInstructions")}>
                <input
                    name="careInstructions"
                    defaultValue={defaults?.careInstructions ?? ""}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </FormField>

            <FormField label="Краткое описание" error={err("shortDescription")}>
                <input
                    name="shortDescription"
                    defaultValue={defaults?.shortDescription ?? ""}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </FormField>

            <FormField label="Описание" error={err("description")}>
                <textarea
                    name="description"
                    rows={5}
                    defaultValue={defaults?.description ?? ""}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </FormField>

            {/* ── Размеры ── */}
            <SizeFormSection sizes={sizes} setSizes={setSizes} error={err("sizes")}/>

            {/* ── Картинки ── */}
            <ImagesFormSection images={images} setImages={setImages} error={err("images")} />

            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={defaults?.isActive ?? true}
                />
                Активен
            </label>

            {/* Массивы уезжают на сервер строкой JSON */}
            <input type="hidden" name="sizes" value={JSON.stringify(sizes)} />
            <input type="hidden" name="images" value={JSON.stringify(images)} />

            <button
                type="submit"
                disabled={pending}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50 justify-self-start"
            >
                {pending
                    ? "Сохраняю…"
                    : mode === "edit"
                        ? "Сохранить изменения"
                        : "Создать товар"}
            </button>
        </form>
    );
}




