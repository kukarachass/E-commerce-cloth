"use client";

import {useMemo, useState, useTransition} from "react";
import {toast} from "sonner";
import toggleAddProduct from "@/lib/admin/actions/categories-actions/toggleAddProduct";

export type PickerProduct = {
    id: string;
    name: string;
    image: string | null;
    gender: string;
    brandName: string | null;
    price: string;
};

export default function ProductPicker({
                                          collectionId,
                                          products,
                                          addedIds,
                                      }: {
    collectionId: string;
    products: PickerProduct[];
    addedIds: string[];
}) {
    // Что было в коллекции на момент загрузки страницы — точка отсчёта для диффа
    const initial = useMemo(() => new Set(addedIds), [addedIds]);

    // Что отмечено сейчас. Стартуем с текущего состояния коллекции
    const [selected, setSelected] = useState<Set<string>>(
        () => new Set(products.filter((p) => initial.has(p.id)).map((p) => p.id)),
    );

    const [pending, start] = useTransition();

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const allOnPage = products.map((p) => p.id);
    const allChecked = allOnPage.length > 0 && allOnPage.every((id) => selected.has(id));

    const toggleAll = () => {
        setSelected(allChecked ? new Set() : new Set(allOnPage));
    };

    // Разница между тем, что было, и тем, что отмечено
    const toAdd = allOnPage.filter((id) => selected.has(id) && !initial.has(id));
    const toRemove = allOnPage.filter((id) => !selected.has(id) && initial.has(id));
    const hasChanges = toAdd.length > 0 || toRemove.length > 0;

    const submit = () => {
        start(async () => {
            // Удаление первым: если товар и убирают, и добавляют — такого быть не может,
            // но порядок делает результат предсказуемым в любом случае
            if (toRemove.length) {
                const res = await toggleAddProduct(collectionId, toRemove, false);
                if (!res.ok)
                    toast.error(res.message ?? "Не удалось убрать товары");
                return
            }

            if (toAdd.length) {
                const res = await toggleAddProduct(collectionId, toAdd, true);
                if (!res.ok)
                    toast.error(res.message ?? "Не удалось добавить товары");
                return;
            }

            toast.success(
                [
                    toAdd.length ? `добавлено ${toAdd.length}` : null,
                    toRemove.length ? `убрано ${toRemove.length}` : null,
                ]
                    .filter(Boolean)
                    .join(", "),
            );
        });
    };

    if (products.length === 0) {
        return <p className="text-gray-500 py-8 text-center">Товаров не найдено</p>;
    }

    return (
        <div>
            <table className="w-full text-left text-sm">
                <thead className="text-gray-500 border-b">
                <tr>
                    <th className="py-2 w-10">
                        <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={toggleAll}
                            aria-label="Выбрать все на странице"
                        />
                    </th>
                    <th className="py-2 w-14"/>
                    <th className="py-2 font-normal">Товар</th>
                    <th className="py-2 font-normal w-24">Цена</th>
                    <th className="py-2 font-normal w-28">В коллекции</th>
                </tr>
                </thead>
                <tbody>
                {products.map((p) => {
                    const checked = selected.has(p.id);
                    const was = initial.has(p.id);
                    const changed = checked !== was;

                    return (
                        <tr
                            key={p.id}
                            onClick={() => toggle(p.id)}
                            className={
                                "border-b cursor-pointer " +
                                (changed ? "bg-amber-50" : "hover:bg-gray-50")
                            }
                        >
                            <td className="py-2">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggle(p.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </td>
                            <td className="py-2">
                                {p.image && (
                                    <img
                                        src={p.image}
                                        alt=""
                                        className="w-10 h-12 object-cover rounded"
                                    />
                                )}
                            </td>
                            <td className="py-2">
                                <div>{p.name}</div>
                                <div className="text-gray-400 text-xs">
                                    {p.brandName ?? "—"} · {p.gender}
                                </div>
                            </td>
                            <td className="py-2">€{p.price}</td>
                            <td className="py-2 text-xs">
                                {was ? (
                                    <span className="text-green-600">да</span>
                                ) : (
                                    <span className="text-gray-400">нет</span>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Панель сохранения появляется только при наличии изменений */}
            {hasChanges && (
                <div className="sticky bottom-4 mt-4 flex items-center gap-4 bg-white border rounded-md px-4 py-3 shadow-sm">
                      <span className="text-sm text-gray-600 flex-1">
                            {toAdd.length > 0 && <>Добавить: {toAdd.length}</>}
                          {toAdd.length > 0 && toRemove.length > 0 && " · "}
                          {toRemove.length > 0 && <>Убрать: {toRemove.length}</>}
                      </span>

                    <button
                        type="button"
                        disabled={pending}
                        onClick={() =>
                            setSelected(
                                new Set(products.filter((p) => initial.has(p.id)).map((p) => p.id)),
                            )
                        }
                        className="px-3 py-1.5 text-sm text-gray-500"
                    >
                        Отменить
                    </button>

                    <button
                        type="button"
                        disabled={pending}
                        onClick={submit}
                        className="px-4 py-2 bg-black text-white rounded-md text-sm disabled:opacity-50"
                    >
                        {pending ? "Сохраняю…" : "Сохранить"}
                    </button>
                </div>
            )}
        </div>
    );
}