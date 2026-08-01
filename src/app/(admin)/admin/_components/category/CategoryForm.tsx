"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {updateCategory} from "@/lib/admin/actions/categories-actions/updateCategory";
import {createCategory} from "@/lib/admin/actions/categories-actions/createCategory";
import {CategoryActionState} from "@/lib/admin/actions/categories-actions/helpers/CategoryActionState";
import slugify from "@/lib/slugify";
import CategoryField from "@/app/(admin)/admin/_components/category/CategoryField";

export type ParentOption = { id: string; name: string; level: number };

export type CategoryDefaults = {
    id: string;
    name: string;
    slug: string;
    gender: string;
    parentId: string | null;
    image: string | null;
};

export default function CategoryForm({
                                         mode,
                                         defaults,
                                         parentOptions,
                                     }: {
    mode: "create" | "edit";
    defaults?: CategoryDefaults;
    /** варианты родителей, сгруппированные по гендеру */
    parentOptions: Record<string, ParentOption[]>;
}) {
    const [state, formAction, pending] = useActionState<CategoryActionState, FormData>(
        mode === "edit" ? updateCategory : createCategory,
        { ok: false },
    );

    const formRef = useRef<HTMLFormElement>(null);
    const [gender, setGender] = useState(defaults?.gender ?? "women");
    const [name, setName] = useState(defaults?.name ?? "");

    useEffect(() => {
        if (!state.ok) return;
        toast.success(state.message ?? "Сохранено");
        if (mode === "create") {
            formRef.current?.reset();
            setName("");
        }
    }, [state, mode]);

    const err = (f: string) => state.errors?.[f]?.[0];

    // Родители фильтруются по выбранному гендеру — вот зачем gender в состоянии
    const available = parentOptions[gender] ?? [];

    return (
        <form ref={formRef} action={formAction} className="max-w-xl grid gap-4">
            {mode === "edit" && defaults && (
                <input type="hidden" name="id" value={defaults.id} />
            )}

            <CategoryField label="Название" error={err("name")}>
                <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </CategoryField>

            <CategoryField label="Гендер" error={err("gender")}>
                <select
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                </select>
            </CategoryField>

            <CategoryField
                label="Родительская категория"
                error={err("parentId")}
                hint="Пусто — категория верхнего уровня"
            >
                <select
                    name="parentId"
                    defaultValue={defaults?.parentId ?? ""}
                    key={gender}
                    className="border rounded-md px-3 py-2 w-full"
                >
                    <option value="">— корневая —</option>
                    {available.map((c) => (
                        <option key={c.id} value={c.id}>
                            {"\u00A0".repeat((c.level - 1) * 4)}
                            {c.level > 1 ? "└ " : ""}
                            {c.name}
                        </option>
                    ))}
                </select>
            </CategoryField>

            <CategoryField label="Slug" error={err("slug")} hint="Пусто — из названия, префикс гендера добавится сам">
                <input
                    name="slug"
                    defaultValue={defaults?.slug ?? ""}
                    placeholder={`${gender}-${slugify(name)}`}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </CategoryField>

            <CategoryField label="Картинка (URL)" error={err("image")}>
                <input
                    name="image"
                    defaultValue={defaults?.image ?? ""}
                    className="border rounded-md px-3 py-2 w-full"
                />
            </CategoryField>

            <button
                type="submit"
                disabled={pending}
                className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50 justify-self-start"
            >
                {pending ? "Сохраняю…" : mode === "edit" ? "Сохранить" : "Создать категорию"}
            </button>
        </form>
    );
}

