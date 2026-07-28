import {db} from "@/db";
import {product, productSize} from "@/db/schema";
import {and, eq, lte} from "drizzle-orm";

export async function getLowStock(limit = 8) {
    return db
        .select({
            productId: product.id,
            productName: product.name,
            size: productSize.size,
            sizeSystem: productSize.sizeSystem,
            stock: productSize.stockAmount,
        })
        .from(productSize)
        .innerJoin(product, eq(productSize.productId, product.id))
        .where(and(eq(product.isActive, true), lte(productSize.stockAmount, 3)))
        .orderBy(productSize.stockAmount)
        .limit(limit);
}