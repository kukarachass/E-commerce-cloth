"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";
import type { CategoryGroup } from "@/lib/admin/queries/categories";
import { updateProduct } from "@/lib/admin/actions/product-actions/productUpdate";
import {
    createProduct,
    type ActionState,
} from "@/lib/admin/actions/product-actions/createProduct";
import slugify from "@/lib/slugify";

import Card, { CardHeader } from "@/app/(admin)/admin/_components/ui/Card";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
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
import ImageUploader from "@/app/(admin)/admin/_components/images/ImageUploader";
import SizeFormSection, {
    emptySize,
} from "@/app/(admin)/admin/_components/product-form/SizeFormSection";
import { euro, toNumber } from "@/app/(admin)/admin/_lib/format";

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

export default function ProductForm({
    brands,
    categoryGroups,
    mode,
    defaults,
}: {
    brands: Option[];
    categoryGroups: CategoryGroup[];
    mode: Mode;
    defaults?: ProductFormDefaults;
}) {
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
    const [price, setPrice] = useState(defaults?.price ?? "");
    const [oldPrice, setOldPrice] = useState(defaults?.oldPrice ?? "");

    useEffect(() => {
        if (!state.ok) return;
        toast.success(state.message ?? "Saved");
        // Очищаем форму только при создании: при редактировании человек
        // остаётся на том же товаре и продолжает работать.
        if (mode === "create") {
            formRef.current?.reset();
            setSizes([emptySize]);
            setImages([]);
            setName("");
            setPrice("");
            setOldPrice("");
        }
    }, [state, mode]);

    const err = (field: string) => state.errors?.[field]?.[0];

    const priceValue = toNumber(price);
    const oldPriceValue = toNumber(oldPrice);
    const discount =
        oldPriceValue > priceValue && oldPriceValue > 0
            ? Math.round(((oldPriceValue - priceValue) / oldPriceValue) * 100)
            : 0;

    const cover = images.find((i) => i.isMain)?.url ?? images[0]?.url;
    const totalStock = sizes.reduce((sum, s) => sum + (s.stockAmount || 0), 0);

    return (
        <form ref={formRef} action={formAction}>
            {mode === "edit" && defaults && (
                <input type="hidden" name="id" value={defaults.id} />
            )}

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                {/* ── поля ───────────────────────────────────────── */}
                <Card className="grid gap-7 p-5 sm:p-6">
                    <FormError message={!state.ok ? state.message : undefined} />

                    <FormSection
                        title="Basics"
                        description="Name and copy shown on the product page."
                    >
                        <Field label="Product name" error={err("name")}>
                            <Input
                                name="name"
                                value={name}
                                invalid={Boolean(err("name"))}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Wide-leg wool trousers"
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
                                placeholder={slugify(name) || "wide-leg-wool-trousers"}
                                invalid={Boolean(err("slug"))}
                            />
                        </Field>

                        <Field label="Short description" error={err("shortDescription")}>
                            <Input
                                name="shortDescription"
                                defaultValue={defaults?.shortDescription ?? ""}
                                placeholder="One line for cards and listings"
                                invalid={Boolean(err("shortDescription"))}
                            />
                        </Field>

                        <Field label="Description" error={err("description")}>
                            <Textarea
                                name="description"
                                rows={5}
                                defaultValue={defaults?.description ?? ""}
                                invalid={Boolean(err("description"))}
                            />
                        </Field>
                    </FormSection>

                    <FormSection
                        title="Pricing"
                        description="Set the old price only when the item is on sale."
                        aside={
                            discount > 0 ? (
                                <Badge tone="accent">−{discount}% discount</Badge>
                            ) : undefined
                        }
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Price" error={err("price")}>
                                <Input
                                    name="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    inputMode="decimal"
                                    placeholder="49.99"
                                    invalid={Boolean(err("price"))}
                                />
                            </Field>

                            <Field label="Old price" error={err("oldPrice")} optional>
                                <Input
                                    name="oldPrice"
                                    value={oldPrice}
                                    onChange={(e) => setOldPrice(e.target.value)}
                                    inputMode="decimal"
                                    placeholder="99.99"
                                    invalid={Boolean(err("oldPrice"))}
                                />
                            </Field>
                        </div>
                    </FormSection>

                    <FormSection
                        title="Placement"
                        description="Where the product shows up in the catalog."
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
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

                            <Field label="Brand" error={err("brandId")}>
                                <Select
                                    name="brandId"
                                    defaultValue={defaults?.brandId ?? ""}
                                    invalid={Boolean(err("brandId"))}
                                >
                                    <option value="">—</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name}
                                        </option>
                                    ))}
                                </Select>
                            </Field>

                            <Field label="Category" error={err("categoryId")}>
                                <Select
                                    name="categoryId"
                                    defaultValue={defaults?.categoryId ?? ""}
                                    invalid={Boolean(err("categoryId"))}
                                >
                                    <option value="">— choose —</option>
                                    {categoryGroups.map((group) => (
                                        <optgroup key={group.gender} label={group.label}>
                                            {group.items.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {" ".repeat((c.level - 1) * 3)}
                                                    {c.level > 1 ? "└ " : ""}
                                                    {c.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </Select>
                            </Field>
                        </div>
                    </FormSection>

                    <FormSection
                        title="Product care"
                        description="Fabric and washing instructions."
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Material" error={err("material")}>
                                <Input
                                    name="material"
                                    defaultValue={defaults?.material ?? ""}
                                    placeholder="80% wool, 20% polyamide"
                                    invalid={Boolean(err("material"))}
                                />
                            </Field>

                            <Field label="Care" error={err("careInstructions")}>
                                <Input
                                    name="careInstructions"
                                    defaultValue={defaults?.careInstructions ?? ""}
                                    placeholder="Dry clean only"
                                    invalid={Boolean(err("careInstructions"))}
                                />
                            </Field>
                        </div>
                    </FormSection>

                    <FormSection
                        title="Inventory"
                        description="Each size carries its own stock counter."
                    >
                        <SizeFormSection
                            sizes={sizes}
                            setSizes={setSizes}
                            error={err("sizes")}
                        />
                    </FormSection>

                    <FormSection
                        title="Media"
                        description="The main image is used across the storefront."
                    >
                        <ImageUploader
                            images={images}
                            onChange={setImages}
                            error={err("images")}
                        />
                    </FormSection>

                    <input type="hidden" name="sizes" value={JSON.stringify(sizes)} />
                </Card>

                {/* ── сводка ─────────────────────────────────────── */}
                <div className="grid content-start gap-3 xl:sticky xl:top-0">
                    <Card>
                        <CardHeader title="Visibility" />
                        <Switch
                            name="isActive"
                            label="Published"
                            hint="Hidden products stay in the catalog but are not sold"
                            defaultChecked={defaults?.isActive ?? true}
                        />
                    </Card>

                    <Card>
                        <CardHeader title="Storefront preview" />

                        <div className="hatch grid h-44 place-items-center overflow-hidden rounded-field bg-sunk">
                            {cover ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={cover}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <ImageIcon
                                    className="h-6 w-6 text-ink-faint"
                                    strokeWidth={1.5}
                                />
                            )}
                        </div>

                        <p className="mt-3 truncate text-sm font-medium text-ink">
                            {name || "Untitled product"}
                        </p>

                        <p className="mt-1 flex items-center gap-2">
                            <span className="tnum text-sm font-semibold text-ink">
                                {euro(priceValue)}
                            </span>
                            {discount > 0 && (
                                <span className="tnum text-xs text-ink-faint line-through">
                                    {euro(oldPriceValue)}
                                </span>
                            )}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                            <Badge tone={totalStock > 0 ? "positive" : "caution"} dot>
                                {totalStock} in stock
                            </Badge>
                            <Badge tone="neutral">
                                {sizes.filter((s) => s.size).length} sizes
                            </Badge>
                            <Badge tone="neutral">{images.length} images</Badge>
                        </div>
                    </Card>
                </div>
            </div>

            <FormFooter
                hint={
                    mode === "edit"
                        ? "Changes go live immediately after saving"
                        : "The product will be created in the catalog"
                }
            >
                <Button type="submit" variant="accent" disabled={pending}>
                    {pending
                        ? "Saving…"
                        : mode === "edit"
                          ? "Save changes"
                          : "Create product"}
                </Button>
            </FormFooter>
        </form>
    );
}
