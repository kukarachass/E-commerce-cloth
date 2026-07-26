"use client";

import {useActionState, useEffect, useRef, useState} from "react";
import { createProduct, type ActionState } from "@/lib/admin/actions/products";
import {CategoryGroup} from "@/lib/admin/queries/categories";
import {toast} from "sonner";

type Option = { id: string; name: string };
type SizeRow = { size: string; sizeSystem: string; stockAmount: number };

export default function ProductForm({
                                        brands,
                                        categoryGroups,
                                    }: {
    brands: Option[];
    categoryGroups: CategoryGroup[];
}) {
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        createProduct,
        { ok: false },
    );
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.ok) {
            formRef.current?.reset();
            setSizes([{ size: "", sizeSystem: "EU", stockAmount: 0 }]);
            setImages([]);
            toast.success("Product has been added.");
        }
    }, [state.ok, state]);


    const [sizes, setSizes] = useState<SizeRow[]>([
        { size: "", sizeSystem: "EU", stockAmount: 0 },
    ]);
    const [images, setImages] = useState<{ url: string; isMain: boolean }[]>([]);
    const [name, setName] = useState("");

    const err = (f: string) => state.errors?.[f]?.[0];

    return (
        <form ref={formRef} action={formAction} className="max-w-2xl grid gap-4">
            <Field label="Название" error={err("name")}>
                <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </Field>

            <Field label="Slug" error={err("slug")}>
                <input
                    name="slug"
                    defaultValue=""
                    key={name}
                    placeholder={slugify(name)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </Field>

            <div className="grid grid-cols-2 gap-4">
                <Field label="Цена без скидки" error={err("originalPrice")}>
                    <input name="originalPrice" placeholder="99.99" className="border rounded-md px-3 py-2 w-full" />
                </Field>
                <Field label="Цена со скидкой" error={err("discountPrice")}>
                    <input name="discountPrice" placeholder="49.99" className="border rounded-md px-3 py-2 w-full" />
                </Field>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Field label="Пол" error={err("gender")}>
                    <select name="gender" className="border rounded-md px-3 py-2 w-full">
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                    </select>
                </Field>
                <Field label="Бренд" error={err("brandId")}>
                    <select name="brandId" className="border rounded-md px-3 py-2 w-full">
                        <option value="">—</option>
                        {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </Field>
                <Field label="Категория" error={err("categoryId")}>
                    <select name="categoryId" defaultValue="" className="border rounded-md px-3 py-2 w-full">
                        <option value="">— выберите категорию —</option>
                        {categoryGroups.map((g) => (
                            <optgroup key={g.gender} label={g.label}>
                                {g.items.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {"\u00A0".repeat((c.level - 1) * 3)}{c.level > 1 ? "└ " : ""}{c.name}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </Field>
            </div>

            <Field label="Материал"><input name="material" className="border rounded-md px-3 py-2 w-full" /></Field>
            <Field label="Уход"><input name="careInstructions" className="border rounded-md px-3 py-2 w-full" /></Field>
            <Field label="Краткое описание"><input name="shortDescription" className="border rounded-md px-3 py-2 w-full" /></Field>
            <Field label="Описание">
                <textarea name="description" rows={5} className="border rounded-md px-3 py-2 w-full" />
            </Field>

            {/* Размеры */}
            <div>
                <div className="mb-2 text-sm text-gray-600">Размеры</div>
                {err("sizes") && <p className="text-red-600 text-sm mb-2">{err("sizes")}</p>}
                {sizes.map((s, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <input
                            placeholder="M"
                            value={s.size}
                            onChange={(e) => setSizes(upd(sizes, i, { size: e.target.value }))}
                            className="border rounded-md px-3 py-2 w-24"
                        />
                        <select
                            value={s.sizeSystem}
                            onChange={(e) => setSizes(upd(sizes, i, { sizeSystem: e.target.value }))}
                            className="border rounded-md px-3 py-2"
                        >
                            {["INT","UK","EU","US","FR","IT","DE","Waist","Waist/Length","Other","Years","Size (cm)"]
                                .map((x) => <option key={x} value={x}>{x}</option>)}
                        </select>
                        <input
                            type="number"
                            min={0}
                            value={s.stockAmount}
                            onChange={(e) => setSizes(upd(sizes, i, { stockAmount: Number(e.target.value) }))}
                            className="border rounded-md px-3 py-2 w-24"
                        />
                        <button type="button" onClick={() => setSizes(sizes.filter((_, x) => x !== i))} className="px-3 text-gray-500">
                            ✕
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => setSizes([...sizes, { size: "", sizeSystem: "EU", stockAmount: 0 }])}
                    className="text-sm text-blue-600"
                >
                    + размер
                </button>
            </div>

            {/* Картинки — пока просто URL, загрузку файлов сделаем отдельно */}
            <div>
                <div className="mb-2 text-sm text-gray-600">Картинки (URL)</div>
                {images.map((img, i) => (
                    <div key={i} className="flex gap-2 mb-2 items-center">
                        <input
                            value={img.url}
                            onChange={(e) =>
                                setImages(images.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))
                            }
                            className="border rounded-md px-3 py-2 flex-1"
                        />
                        <label className="text-sm flex items-center gap-1">
                            <input
                                type="radio"
                                name="mainImage"
                                checked={img.isMain}
                                onChange={() => setImages(images.map((x, j) => ({ ...x, isMain: j === i })))}
                            />
                            главная
                        </label>
                        <button type="button" onClick={() => setImages(images.filter((_, x) => x !== i))} className="px-2 text-gray-500">✕</button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => setImages([...images, { url: "", isMain: images.length === 0 }])}
                    className="text-sm text-blue-600"
                >
                    + картинка
                </button>
            </div>

            <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" defaultChecked />
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
                {pending ? "Сохраняю…" : "Создать товар"}
            </button>
        </form>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-1">
            <span className="text-sm text-gray-600">{label}</span>
            {children}
            {error && <span className="text-red-600 text-sm">{error}</span>}
        </label>
    );
}

function upd(rows: SizeRow[], i: number, patch: Partial<SizeRow>) {
    return rows.map((r, j) => (j === i ? { ...r, ...patch } : r));
}

function slugify(s: string) {
    return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}