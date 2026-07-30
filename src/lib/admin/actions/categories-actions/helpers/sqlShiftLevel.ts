import {sql} from "drizzle-orm";
import {category} from "@/db/schema";

export default function sqlShiftLevel(id: string, shift: number) {
    return sql`
    update ${category} set level = level + ${shift} where id = ${id}
  `;
}