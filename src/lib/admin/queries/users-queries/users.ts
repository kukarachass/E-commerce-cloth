import "server-only";
import {requireAdmin} from "@/lib/admin/rbac";
import {Gender} from "@/hooks/useGender";
import {and, count, desc, eq, ilike, or} from "drizzle-orm";
import {user} from "@/db/schema";
import {db} from "@/db";

interface UsersListParams {
    page?: number;
    search?: string;
    gender?: Gender | "all";
}

const PER_PAGE = 20;

export default async function getUsers({ page = 1, search, gender = "all" }: UsersListParams) {
    await requireAdmin();

    const conditions = [];

    if (search) {
        conditions.push(
            or(
                ilike(user.name, `%${search}%`),
                ilike(user.email, `%${search}%`),
            ),
        );
    }
    if (gender === "men" || gender === "women") conditions.push(eq(user.gender, gender));

    const where = conditions.length ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
        db.select({
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            stripeCustomerId: user.stripeCustomerId,
        })
            .from(user)
            .where(where)
            .orderBy(desc(user.createdAt))
            .limit(PER_PAGE)
            .offset((page - 1) * PER_PAGE),
        db.select({ total: count() }).from(user).where(where),
    ]);

    return {
        rows,
        total,
        page,
        perPage: PER_PAGE,
        totalPages: Math.ceil(total / PER_PAGE),
    };
}