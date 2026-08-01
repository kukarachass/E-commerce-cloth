import {requireAdmin} from "@/lib/admin/rbac";
import {db} from "@/db";

export default async function getUserById(id: string){
    await requireAdmin();

    return await db.query.user.findFirst({
        where: (us, { eq }) => eq(us.id, id),
        with: {
            orders: {
                orderBy: (o, { desc }) => [desc(o.createdAt)],
                with: {
                    items: {
                        with: {
                            product: true,
                            productSize: true,
                        }
                    }
                }
            },
            cart: {
                with: {
                    items: {
                        with: {
                            product: true,
                            productSize: true,
                        }
                    }
                }
            },
            sessions: true,
        },
    })
}