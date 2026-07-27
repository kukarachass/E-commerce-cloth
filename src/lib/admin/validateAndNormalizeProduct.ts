import {productFormSchema, ProductFormValues} from "@/lib/admin/validation/product";
import {z} from "zod";

type FormErrors = z.inferFlattenedErrors<typeof productFormSchema>["fieldErrors"];

// Делаем интерфейс результата более гибким (дискриминантное объединение)
export type FuncRes =
    | { ok: false; errors: FormErrors }
    | { ok: true; data: ProductFormValues; discount: number; price: string; oldPrice: string };


interface Props{
    formData: FormData
}

export default async function validateAndNormalizeProduct({ formData }: Props): Promise<FuncRes> {
    const raw = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        shortDescription: formData.get("shortDescription"),
        description: formData.get("description"),
        oldPrice: formData.get("oldPrice"),
        price: formData.get("price"),
        material: formData.get("material"),
        careInstructions: formData.get("careInstructions"),
        gender: formData.get("gender"),
        brandId: formData.get("brandId"),
        categoryId: formData.get("categoryId"),
        isActive: formData.get("isActive") === "on",
        sizes: JSON.parse((formData.get("sizes") as string) || "[]"),
        images: JSON.parse((formData.get("images") as string) || "[]"),
    };

    const parsed = productFormSchema.safeParse(raw);
    if (!parsed.success) {
        return {ok: false, errors: parsed.error.flatten().fieldErrors};
    }
    const data = parsed.data;

// Нормализация цен: запятую в точку, старая цена по умолчанию = текущей
    const price = data.price.replace(",", ".");
    const oldPrice = data.oldPrice ? data.oldPrice.replace(",", ".") : price;

    const discount =
        Number(oldPrice) > Number(price)
            ? Math.round((1 - Number(price) / Number(oldPrice)) * 100)
            : 0;

    return { ok: true, data, discount, price, oldPrice}
}