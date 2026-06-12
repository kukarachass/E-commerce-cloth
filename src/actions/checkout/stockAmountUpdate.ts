import {asc, eq, inArray} from "drizzle-orm";
import {productSize} from "@/db/schema";
import {DbTx} from "@/types/IDb";

interface StockAmountUpdateProps{
    orderId: string;
    tx: DbTx;
}

export async function stockAmountUpdate({ orderId, tx }: StockAmountUpdateProps){
    const ord = await tx.query.order.findFirst({
        where: (order, { eq }) => eq(order.id, orderId),
        with: {
            items: {
                with: { product: true, productSize: true },
            }
        }
    })

    if(!ord) throw new Error("Order not found");
    if(ord.paymentStatus !== "paid") return null;

    const sizeIds = ord.items.map((item) => item.productSizeId)
    const lockedSizes = await tx
        .select()
        .from(productSize)
        .where(inArray(productSize.id, sizeIds))
        .orderBy(asc(productSize.id))
        .for("update")

    const stockMap = new Map(lockedSizes.map((s) => [s.id, s]))

    for(const item of ord.items){
        const stock = stockMap.get(item.productSizeId);
        if (!stock || stock.stockAmount < item.quantity) throw new Error(`OUT_OF_STOCK:${item.productId}`);

        await tx.update(productSize)
            .set({ stockAmount: stock.stockAmount - item.quantity })
            .where(eq(productSize.id, item.productSizeId))
    }
}