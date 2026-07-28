import "server-only";
import { db } from "@/db";
import { product, productSize } from "@/db/schema";
import { and, count, eq, lte } from "drizzle-orm";

const LOW_STOCK_THRESHOLD = 1;

export async function getLowStock(limit = 8) {
    const where = and(
        eq(product.isActive, true),
        lte(productSize.stockAmount, LOW_STOCK_THRESHOLD),
    );

    const [rows, [{ totalLowStock }]] = await Promise.all([
        db
            .select({
                productId: product.id,
                productName: product.name,
                size: productSize.size,
                sizeSystem: productSize.sizeSystem,
                stock: productSize.stockAmount,
            })
            .from(productSize)
            .innerJoin(product, eq(productSize.productId, product.id))
            .where(where)
            .orderBy(productSize.stockAmount)
            .limit(limit),

        db
            .select({ totalLowStock: count() })
            .from(productSize)
            .innerJoin(product, eq(productSize.productId, product.id)) // ← без этого падает
            .where(where),
    ]);

    return { rows, totalLowStock };
}