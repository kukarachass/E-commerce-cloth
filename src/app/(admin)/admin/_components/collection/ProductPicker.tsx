"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, ImageIcon, PackageSearch } from "lucide-react";
import toggleAddProduct from "@/lib/admin/actions/categories-actions/toggleAddProduct";
import cn from "@/app/(admin)/admin/_lib/cn";
import Button from "@/app/(admin)/admin/_components/ui/Button";
import Badge from "@/app/(admin)/admin/_components/ui/Badge";
import EmptyState from "@/app/(admin)/admin/_components/ui/EmptyState";
import { euro } from "@/app/(admin)/admin/_lib/format";

export type PickerProduct = {
    id: string;
    name: string;
    image: string | null;
    gender: string;
    brandName: string | null;
    price: string;
};

/**
 * Выбор товаров в коллекцию. Работает с диффом относительно того, что было
 * в коллекции на момент загрузки страницы: показываем ровно то, что уедет
 * на сервер, и не трогаем товары с других страниц выдачи.
 */
export default function ProductPicker({
    collectionId,
    products,
    addedIds,
}: {
    collectionId: string;
    products: PickerProduct[];
    addedIds: string[];
}) {
    const initial = useMemo(() => new Set(addedIds), [addedIds]);

    const [selected, setSelected] = useState<Set<string>>(
        () => new Set(products.filter((p) => initial.has(p.id)).map((p) => p.id)),
    );
    const [pending, start] = useTransition();

    const toggle = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const idsOnPage = products.map((p) => p.id);
    const allChecked =
        idsOnPage.length > 0 && idsOnPage.every((id) => selected.has(id));

    const toAdd = idsOnPage.filter((id) => selected.has(id) && !initial.has(id));
    const toRemove = idsOnPage.filter(
        (id) => !selected.has(id) && initial.has(id),
    );
    const hasChanges = toAdd.length > 0 || toRemove.length > 0;

    const reset = () =>
        setSelected(
            new Set(products.filter((p) => initial.has(p.id)).map((p) => p.id)),
        );

    const submit = () => {
        start(async () => {
            // Сначала снимаем, потом добавляем — порядок делает результат
            // предсказуемым, если обе группы непустые.
            if (toRemove.length) {
                const res = await toggleAddProduct(collectionId, toRemove, false);
                if (!res.ok) {
                    toast.error(res.message ?? "Could not remove products");
                    return;
                }
            }

            if (toAdd.length) {
                const res = await toggleAddProduct(collectionId, toAdd, true);
                if (!res.ok) {
                    toast.error(res.message ?? "Could not add products");
                    return;
                }
            }

            toast.success(
                [
                    toAdd.length ? `${toAdd.length} added` : null,
                    toRemove.length ? `${toRemove.length} removed` : null,
                ]
                    .filter(Boolean)
                    .join(" · "),
            );
        });
    };

    if (products.length === 0) {
        return (
            <EmptyState
                icon={PackageSearch}
                title="No products match this search"
                description="Only active products of the same audience are listed."
            />
        );
    }

    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs text-ink-faint">
                    {selected.size} selected on this page
                </p>
                <Button
                    variant="soft"
                    size="sm"
                    onClick={() =>
                        setSelected(allChecked ? new Set() : new Set(idsOnPage))
                    }
                >
                    {allChecked ? "Clear page" : "Select page"}
                </Button>
            </div>

            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => {
                    const checked = selected.has(product.id);
                    const was = initial.has(product.id);
                    const changed = checked !== was;

                    return (
                        <li key={product.id}>
                            <button
                                type="button"
                                onClick={() => toggle(product.id)}
                                className={cn(
                                    "group relative w-full overflow-hidden rounded-card bg-card p-2 text-left transition-all duration-200",
                                    checked
                                        ? "ring-2 ring-accent"
                                        : "ring-1 ring-line-strong hover:ring-ink/20",
                                )}
                            >
                                <span className="hatch relative block aspect-[3/4] overflow-hidden rounded-xl bg-sunk">
                                    {product.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={product.image}
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="grid grid-cols-1 h-full place-items-center">
                                            <ImageIcon className="h-5 w-5 text-ink-faint" />
                                        </span>
                                    )}

                                    <span
                                        className={cn(
                                            "absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full transition-colors",
                                            checked
                                                ? "bg-accent text-white"
                                                : "bg-card/90 text-transparent group-hover:text-ink-faint",
                                        )}
                                    >
                                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                    </span>

                                    {changed && (
                                        <span className="absolute bottom-2 left-2">
                                            <Badge tone={checked ? "positive" : "critical"}>
                                                {checked ? "will add" : "will remove"}
                                            </Badge>
                                        </span>
                                    )}
                                </span>

                                <span className="mt-2 block truncate px-1 text-sm font-medium text-ink">
                                    {product.name}
                                </span>
                                <span className="mt-0.5 flex items-baseline justify-between gap-2 px-1 pb-1">
                                    <span className="truncate text-xs text-ink-faint">
                                        {product.brandName ?? "—"}
                                    </span>
                                    <span className="tnum shrink-0 text-xs font-semibold text-ink">
                                        {euro(product.price)}
                                    </span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>

            {hasChanges && (
                <div className="sticky bottom-4 z-10 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full border border-line-strong bg-card/85 px-4 py-2.5 shadow-float backdrop-blur-md">
                    <span className="flex items-center gap-2 text-xs">
                        {toAdd.length > 0 && (
                            <Badge tone="positive">+{toAdd.length} to add</Badge>
                        )}
                        {toRemove.length > 0 && (
                            <Badge tone="critical">−{toRemove.length} to remove</Badge>
                        )}
                    </span>

                    <span className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={pending}
                            onClick={reset}
                        >
                            Discard
                        </Button>
                        <Button
                            variant="accent"
                            size="sm"
                            disabled={pending}
                            onClick={submit}
                        >
                            {pending ? "Saving…" : "Save selection"}
                        </Button>
                    </span>
                </div>
            )}
        </div>
    );
}
