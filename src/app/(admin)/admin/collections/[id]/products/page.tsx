import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/rbac";
import { getCollectionById } from "@/lib/admin/queries/collections";
import { getProductList } from "@/lib/admin/queries/products";
import ProductPicker from "@/app/(admin)/admin/_components/collection/ProductPicker";
import getCollectionProductIds from "@/lib/admin/actions/collection-actions/getCollectionProducts";
import {Gender} from "@/hooks/useGender";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}

export default async function CollectionProductsPage({
                                                         params,
                                                         searchParams,
                                                     }: Props) {
    await requireAdmin();

    const { id } = await params;
    const sp = await searchParams;
    const search = Array.isArray(sp.search) ? sp.search[0] : sp.search;
    const page = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1;

    const [collection, addedIds] = await Promise.all([
        getCollectionById(id),
        getCollectionProductIds(id),
    ]);

    if (!collection) notFound();
    const catalog = await getProductList({ page, search, status: "active", gender: collection.gender as Gender});

    const pageUrl = (p: number) => {
        const q = new URLSearchParams();
        if (search) q.set("search", search);
        q.set("page", String(p));
        return `/admin/collections/${id}/products?${q}`;
    };

    return (
        <div className="max-w-4xl">
            <Link href={`/admin/collections/${id}`} className="text-sm text-gray-500">
                ← К коллекции
            </Link>

            <div className="flex items-start justify-between mt-2 mb-6">
                <div>
                    <h1 className="text-xl">{collection.title}</h1>
                    <p className="text-sm text-gray-500">
                        В коллекции: {addedIds.length} товаров
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="px-4 py-2 border rounded-md text-sm"
                >
                    Создать товар
                </Link>
            </div>

            <form className="flex gap-2 mb-4">
                <input
                    name="search"
                    defaultValue={search ?? ""}
                    placeholder="Поиск по названию"
                    className="border rounded-md px-3 py-2 flex-1"
                />
                <button className="px-4 py-2 border rounded-md">Найти</button>
            </form>

            {/* key заставляет компонент пересоздаться при смене страницы или поиска,
          иначе он сохранит выбор от предыдущего набора товаров */}
            <ProductPicker
                key={`${page}-${search ?? ""}`}
                collectionId={id}
                products={catalog.rows.map((p) => ({
                    id: p.id,
                    name: p.name,
                    image: p.image,
                    gender: p.gender,
                    brandName: p.brandName,
                    price: p.discountPrice,
                }))}
                addedIds={addedIds}
            />

            {catalog.totalPages > 1 && (
                <div className="flex gap-2 mt-6 items-center">
                    {page > 1 && (
                        <Link href={pageUrl(page - 1)} className="px-3 py-1 border rounded-md">
                            Назад
                        </Link>
                    )}
                    <span className="text-gray-500 text-sm">
            Страница {page} из {catalog.totalPages}
          </span>
                    {page < catalog.totalPages && (
                        <Link href={pageUrl(page + 1)} className="px-3 py-1 border rounded-md">
                            Вперёд
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}