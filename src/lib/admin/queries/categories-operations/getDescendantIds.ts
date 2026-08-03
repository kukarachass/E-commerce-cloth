import "server-only";

import {db} from "@/db";
import {sql} from "drizzle-orm";
import {category} from "@/db/schema";

export async function getDescendantIds(id: string): Promise<string[]> {
    const { rows } = await db.execute<{ id: string }>(sql`
    with recursive descendants as (
      select id from ${category} where parent_id = ${id}
      union all
      select c.id from ${category} c
      join descendants d on c.parent_id = d.id
    )
    select id from descendants
  `);
    return rows.map((r) => r.id);
}