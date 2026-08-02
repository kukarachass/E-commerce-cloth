"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Plus, Tag, X } from "lucide-react";
import { updateBrand } from "@/lib/admin/actions/brand-actions/updateBrand";
import { createBrand } from "@/lib/admin/actions/brand-actions/createBrand";
import type { BrandActionState } from "@/lib/admin/actions/brand-actions/types/BrandActionState";
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
    Switch,
    Textarea,
} from "@/app/(admin)/admin/_components/ui/Form";
import ImageUploader, {
    type ImageRow,
} from "@/app/(admin)/admin/_components/images/ImageUploader";

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
        toast.success(state.message ?? "Saved");
        if (mode === "create") {
            formRef.current?.reset();
            setName("");
            setTags([]);
            setLogo([]);
        }
    }, [state, mode]);

    const err = (field: string) => state.errors?.[field]?.[0];

    const addTag = () => {
        const value = tagInput.trim();
        if (value && !tags.includes(value)) setTags([...tags, value]);
        setTagInput("");
    };

    return (
        <form ref={formRef} action={formAction}>
            {mode === "edit" && defaults && (
                <input type="hidden" name="id" value={defaults.id} />
            )}

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                <Card className="grid grid-cols-1 gap-7 p-5 sm:p-6">
                    <FormError message={!state.ok ? state.message : undefined} />

                    <FormSection
                        title="Brand"
                        description="How the brand is introduced across the store."
                    >
                        <Field label="Name" error={err("name")}>
                            <Input
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                invalid={Boolean(err("name"))}
                                placeholder="Maison Ordinaire"
                            />
                        </Field>

                        <Field
                            label="Slug"
                            error={err("slug")}
                            hint="Leave empty to generate from the name"
                            optional
                        >
                            <Input
                                name="slug"
                                defaultValue={defaults?.slug ?? ""}
                                placeholder={slugify(name) || "maison-ordinaire"}
                                invalid={Boolean(err("slug"))}
                            />
                        </Field>

                        <Field label="Description" error={err("description")}>
                            <Textarea
                                name="description"
                                rows={4}
                                defaultValue={defaults?.description ?? ""}
                                invalid={Boolean(err("description"))}
                            />
                        </Field>

                        <Field
                            label="Promo line"
                            error={err("promoDetailsText")}
                            hint="Short highlight on the brand banner, e.g. “up to −70%”"
                            optional
                        >
                            <Input
                                name="promoDetailsText"
                                defaultValue={defaults?.promoDetailsText ?? ""}
                                invalid={Boolean(err("promoDetailsText"))}
                            />
                        </Field>
                    </FormSection>

                    <FormSection
                        title="Logo"
                        description="One image, shown on brand cards and banners."
                    >
                        <ImageUploader
                            images={logo}
                            onChange={(next) => setLogo(next.slice(-1))}
                            error={err("imageUrl")}
                            name={null}
                            single
                            label="Brand logo"
                            hint="Transparent PNG or SVG-like artwork works best"
                        />
                        <input
                            type="hidden"
                            name="imageUrl"
                            value={logo[0]?.url ?? ""}
                        />
                    </FormSection>

                    <FormSection
                        title="Tags"
                        description="Used for filtering and merchandising blocks."
                    >
                        {tags.length > 0 && (
                            <ul className="flex flex-wrap gap-1.5">
                                {tags.map((tag) => (
                                    <li key={tag}>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sunk py-1.5 pr-1.5 pl-3 text-xs font-medium text-ink">
                                            {tag}
                                            <button
                                                type="button"
                                                aria-label={`Remove ${tag}`}
                                                onClick={() =>
                                                    setTags(tags.filter((t) => t !== tag))
                                                }
                                                className="grid grid-cols-1 h-4 w-4 place-items-center rounded-full text-ink-faint transition-colors hover:bg-critical hover:text-white"
                                            >
                                                <X className="h-2.5 w-2.5" />
                                            </button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault(); // иначе Enter отправит форму
                                        addTag();
                                    }
                                }}
                                placeholder="premium, sale…"
                            />
                            <Button variant="soft" onClick={addTag}>
                                <Plus className="h-4 w-4" />
                                Add
                            </Button>
                        </div>

                        <input type="hidden" name="tags" value={JSON.stringify(tags)} />
                    </FormSection>
                </Card>

                <div className="grid grid-cols-1 content-start gap-3 xl:sticky xl:top-0">
                    <Card>
                        <CardHeader title="Visibility" />
                        <Switch
                            name="isActive"
                            label="Active"
                            hint="Hidden brands disappear from filters and listings"
                            defaultChecked={defaults?.isActive ?? true}
                        />
                    </Card>

                    <Card>
                        <CardHeader title="Preview" />
                        <div className="hatch grid grid-cols-1 h-32 place-items-center overflow-hidden rounded-field bg-sunk">
                            {logo[0]?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={logo[0].url}
                                    alt=""
                                    className="h-full w-full object-contain p-4"
                                />
                            ) : (
                                <Tag className="h-6 w-6 text-ink-faint" strokeWidth={1.5} />
                            )}
                        </div>

                        <p className="mt-3 truncate text-sm font-medium text-ink">
                            {name || "Untitled brand"}
                        </p>
                        <p className="truncate text-xs text-ink-faint">
                            /{slugify(name) || "slug"}
                        </p>

                        {tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                                {tags.slice(0, 6).map((tag) => (
                                    <Badge key={tag} tone="neutral">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <FormFooter
                hint={
                    mode === "edit"
                        ? "Changes apply to every product of this brand"
                        : "The brand becomes selectable in the product form"
                }
            >
                <Button type="submit" variant="accent" disabled={pending}>
                    {pending
                        ? "Saving…"
                        : mode === "edit"
                          ? "Save changes"
                          : "Create brand"}
                </Button>
            </FormFooter>
        </form>
    );
}
