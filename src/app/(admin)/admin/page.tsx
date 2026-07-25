import {requireAdmin} from "@/lib/admin/rbac";

export default async function AdminDashboard() {
    const { userId, role } = await requireAdmin();
    return (
        <div>
            <h1>Дашборд</h1>
            <p>Вход выполнен. userId: {userId}, роль: {role}</p>
        </div>
    );
}