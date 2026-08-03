import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
    ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

// обычный покупатель — никаких админских прав
export const customer = ac.newRole({});

// админ — полный доступ ко всем user/session действиям
export const admin = ac.newRole({
    ...adminAc.statements,
});