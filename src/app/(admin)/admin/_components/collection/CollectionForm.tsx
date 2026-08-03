"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Layers } from "lucide-react";
import type { FormActionState } from "@/lib/admin/admin-types/FormActionState";
import { updateCollection } from "@/lib/admin/actions/collection-actions/updateCollection";
import { createCollection } from "@/lib/admin/actions/collection-actions/createCollection";
import slugify from "@/lib/slugify";

import Card, { CardHeader } from "@/app/(admin)/admin/_components/ui/Card";
import Button from "@/app/(admin)/admin/_components/ui/Button";
import {
    Field,
    FormError,
    FormFooter,
    FormSection,
    Input,
    Select,
    Switch,
    Textarea,
} from "@/app/(admin)/admin/_components/ui/Form";
import ImageUploader, {
    type ImageRow,
} from "@/app/(admin)/admin/_components/images/ImageUploader";

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
        { ok: false },
    );

    const formRef = useRef<HTMLFormElement>(null);
    const [title, setTitle] = useState(defaults?.title ?? "");
    const [banner, setBanner] = useState<ImageRow[]>(
        defaults?.banner ? [{ url: defaults.banner, isMain: true }] : [],
    );

    useEffect(() => {
        if (!state.ok) return;
        toast.success(state.message ?? "Saved");
        if (mode === "create") {
            formRef.current?.reset();
            setTitle("");
            setBanner([]);
        }
    }, [state, mode]);

    const err = (field: string) => state.errors?.[field]?.[0];

    return (
        <form ref={formRef} action={formAction}>
            {mode === "edit" && defaults && (
                <input type="hidden" name="id" value={defaults.id} />
            )}

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <Card className="grid grid-cols-1 gap-7 p-5 sm:p-6">
                    <FormError message={!state.ok ? state.message : undefined} />

                    <FormSection
                        title="Collection"
                        description="A curated edit customers can browse as one story."
                    >
                        <Field label="Title" error={err("title")}>
                            <Input
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                invalid={Boolean(err("title"))}
                                placeholder="Winter essentials"
                            />
                        </Field>

                        <Field
                            label="Slug"
                            error={err("slug")}
                            hint="Leave empty to generate from the title"
                            optional
                        >
                            <Input
                                name="slug"
                                defaultValue={defaults?.slug ?? ""}
                                placeholder={slugify(title) || "winter-essentials"}
                                invalid={Boolean(err("slug"))}
                            />
                        </Field>

                        <Field label="Audience" error={err("gender")}>
                            <Select
                                name="gender"
                                defaultValue={defaults?.gender ?? "women"}
                                invalid={Boolean(err("gender"))}
                            >
                                <option value="women">Women</option>
                                <option value="men">Men</option>
                            </Select>
                        </Field>

                        <Field label="Description" error={err("description")} optional>
                            <Textarea
                                name="description"
                                rows={4}
                                defaultValue={defaults?.description ?? ""}
                                invalid={Boolean(err("description"))}
                            />
                        </Field>
                    </FormSection>

                    <FormSection
                        title="Banner"
                        description="Wide image used at the top of the collection page."
                    >
                        <ImageUploader
                            images={banner}
                            onChange={(next) => setBanner(next.slice(-1))}
                            error={err("banner")}
                            name={null}
                            single
                            label="Collection banner"
                            hint="Landscape artwork, at least 1600px wide"
                        />
                        {/* поле называется banner — именно его читает серверный экшен */}
                        <input
                            type="hidden"
                            name="banner"
                            value={banner[0]?.url ?? ""}
                        />
                    </FormSection>
                </Card>

                <div className="grid grid-cols-1 content-start gap-3 xl:sticky xl:top-0">
                    <Card>
                        <CardHeader title="Visibility" />
                        <Switch
                            name="isActive"
                            label="Active"
                            hint="Hidden collections stay editable but are not published"
                            defaultChecked={defaults?.isActive ?? true}
                        />
                    </Card>

                    <Card>
                        <CardHeader title="Preview" />
                        <div className="hatch grid grid-cols-1 h-28 place-items-center overflow-hidden rounded-field bg-sunk">
                            {banner[0]?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={banner[0].url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Layers
                                    className="h-6 w-6 text-ink-faint"
                                    strokeWidth={1.5}
                                />
                            )}
                        </div>

                        <p className="mt-3 truncate text-sm font-medium text-ink">
                            {title || "Untitled collection"}
                        </p>
                        <p className="truncate text-xs text-ink-faint">
                            /{slugify(title) || "slug"}
                        </p>
                    </Card>
                </div>
            </div>

            <FormFooter
                hint={
                    mode === "edit"
                        ? "Changes are visible on the storefront right away"
                        : "You can add products right after creating the collection"
                }
            >
                <Button type="submit" variant="accent" disabled={pending}>
                    {pending
                        ? "Saving…"
                        : mode === "edit"
                          ? "Save changes"
                          : "Create collection"}
                </Button>
            </FormFooter>
        </form>
    );
}
