import {brand, product} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";
import {logAudit} from "@/lib/admin/audit";
import {revalidatePath} from "next/cache";
import {BrandActionState} from "@/lib/admin/actions/brand-actions/types/BrandActionState";

export async function toggleBrandActive(
    id: string,
    isActive: boolean,
): Promise<BrandActionState> {
    const { session } = await requireAdmin();

    const before = await db.query.brand.findFirst({
        where: eq(brand.id, id),
        columns: { id: true, name: true, isActive: true },
    });
    if (!before) return { ok: false, message: "Бренд не найден" };

    // Скрывать бренд с активными товарами — почти всегда ошибка:
    // товары останутся в каталоге, а бренд из фильтров исчезнет
    if (!isActive) {
        const [{ n }] = await db
            .select({ n: db.$count(product, and(eq(product.brandId, id), eq(product.isActive, true))) })
            .from(brand)
            .where(eq(brand.id, id))
            .limit(1)
            .then((r) => r.map((x) => ({ n: Number(x.n) })));

        if (n > 0) {
            return {
                ok: false,
                message: `У бренда ${n} активных товаров — сначала скройте их`,
            };
        }
    }

    await db.transaction(async (tx) => {
        await tx.update(brand).set({ isActive }).where(eq(brand.id, id));
        await logAudit(tx, {
            actorId: session.user.id,
            actorEmail: session.user.email,
            action: isActive ? "restore" : "delete",
            entityType: "brand",
            entityId: id,
            before: { isActive: before.isActive },
            after: { isActive },
        });
    });

    revalidatePath("/admin/brands");
    return { ok: true, message: isActive ? "Бренд активен" : "Бренд скрыт" };
}