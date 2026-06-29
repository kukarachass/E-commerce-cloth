"use server"

import {db} from "@/db";
import {getServerSession} from "@/lib/get-session";

export async function getOrders() {
    const session = await getServerSession();
    if(!session) throw new Error("Unauthorized");
    const user = session.user;
    if(!user) throw new Error("User not found");

    return await db.query.order.findMany({
        where: (order, { eq }) => eq(order.userId, user.id),
        with: {
            items: {
                with: { product: true, returnItems: true },
            },
            returns: {
                with: { items: true }
            }
        }
    })

}