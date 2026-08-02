"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FolderTree } from "lucide-react";
import { updateCategory } from "@/lib/admin/actions/categories-actions/updateCategory";
import { createCategory } from "@/lib/admin/actions/categories-actions/createCategory";
import type { CategoryActionState } from "@/lib/admin/actions/categories-actions/helpers/CategoryActionState";
import slugify from "@/lib/slugify";

import Card, { CardHeader } from "@/app/(admin)/admin/_components/ui/Card";
import Button from "@/app/(admin)/admin/_components/ui/Button";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import {
    Field,
    FormError,
    FormFooter,
    FormSection,
    Input,
    Select,
} from "@/app/(admin)/admin/_components/ui/Form";

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
    const [state, formAction, pending] = useActionState<
        CategoryActionState,
        FormData
    >(mode === "edit" ? updateCategory : createCategory, { ok: false });

    const formRef = useRef<HTMLFormElement>(null);
    const [gender, setGender] = useState(defaults?.gender ?? "women");
    const [name, setName] = useState(defaults?.name ?? "");
    const [parentId, setParentId] = useState(defaults?.parentId ?? "");

    useEffect(() => {
        if (!state.ok) return;
        toast.success(state.message ?? "Saved");
        if (mode === "create") {
            formRef.current?.reset();
            setName("");
            setParentId("");
        }
    }, [state, mode]);

    const err = (field: string) => state.errors?.[field]?.[0];

    // Родители фильтруются по выбранному гендеру — за этим и живёт gender в состоянии
    const available = parentOptions[gender] ?? [];
    const parent = available.find((option) => option.id === parentId);
    const level = parent ? parent.level + 1 : 1;

    return (
        <form ref={formRef} action={formAction}>
            {mode === "edit" && defaults && (
                <input type="hidden" name="id" value={defaults.id} />
            )}

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <Card className="grid gap-7 p-5 sm:p-6">
                    <FormError message={!state.ok ? state.message : undefined} />

                    <FormSection
                        title="Category"
                        description="Categories build the navigation tree of the catalog."
                    >
                        <Field label="Name" error={err("name")}>
                            <Input
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                invalid={Boolean(err("name"))}
                                placeholder="Knitwear"
                            />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Audience" error={err("gender")}>
                                <Select
                                    name="gender"
                                    value={gender}
                                    onChange={(e) => {
                                        setGender(e.target.value);
                                        setParentId(""); // родители другого гендера не подходят
                                    }}
                                    invalid={Boolean(err("gender"))}
                                >
                                    <option value="women">Women</option>
                                    <option value="men">Men</option>
                                </Select>
                            </Field>

                            <Field
                                label="Parent category"
                                error={err("parentId")}
                                hint="Empty means a top-level category"
                            >
                                <Select
                                    name="parentId"
                                    value={parentId}
                                    onChange={(e) => setParentId(e.target.value)}
                                    invalid={Boolean(err("parentId"))}
                                >
                                    <option value="">— root level —</option>
                                    {available.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {" ".repeat((option.level - 1) * 4)}
                                            {option.level > 1 ? "└ " : ""}
                                            {option.name}
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                        </div>

                        <Field
                            label="Slug"
                            error={err("slug")}
                            hint="Leave empty to generate — the audience prefix is added automatically"
                            optional
                        >
                            <Input
                                name="slug"
                                defaultValue={defaults?.slug ?? ""}
                                placeholder={`${gender}-${slugify(name) || "knitwear"}`}
                                invalid={Boolean(err("slug"))}
                            />
                        </Field>

                        <Field label="Image URL" error={err("image")} optional>
                            <Input
                                name="image"
                                defaultValue={defaults?.image ?? ""}
                                placeholder="https://…"
                                invalid={Boolean(err("image"))}
                            />
                        </Field>
                    </FormSection>
                </Card>

                <div className="grid content-start gap-3 xl:sticky xl:top-0">
                    <Card>
                        <CardHeader
                            title="Placement"
                            hint="Where this category lands in the tree"
                        />

                        <div className="rounded-field bg-sunk px-3.5 py-3 text-sm">
                            <p className="flex items-center gap-2 text-ink-soft">
                                <FolderTree className="h-4 w-4" strokeWidth={1.8} />
                                {gender === "men" ? "Men" : "Women"}
                            </p>

                            {parent && (
                                <p className="mt-1.5 ml-6 border-l border-line-strong pl-3 text-ink-soft">
                                    {parent.name}
                                </p>
                            )}

                            <p
                                className={
                                    parent
                                        ? "mt-1.5 ml-12 border-l border-line-strong pl-3 font-medium text-ink"
                                        : "mt-1.5 ml-6 border-l border-line-strong pl-3 font-medium text-ink"
                                }
                            >
                                {name || "New category"}
                            </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                            <Badge tone="neutral">Level {level}</Badge>
                            <Badge tone="neutral">
                                /{slugify(name) ? `${gender}-${slugify(name)}` : "slug"}
                            </Badge>
                        </div>
                    </Card>
                </div>
            </div>

            <FormFooter
                hint={
                    mode === "edit"
                        ? "Moving a category moves its children too"
                        : "The category appears in the tree right after saving"
                }
            >
                <Button type="submit" variant="accent" disabled={pending}>
                    {pending
                        ? "Saving…"
                        : mode === "edit"
                          ? "Save changes"
                          : "Create category"}
                </Button>
            </FormFooter>
        </form>
    );
}
