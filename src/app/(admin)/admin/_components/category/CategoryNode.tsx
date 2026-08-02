import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CategoryTreeNode } from "@/lib/admin/queries/categories-operations/cat-types";
import cn from "@/app/(admin)/admin/_lib/cn";

/**
 * Узел дерева категорий. Вложенность рисуется настоящими отступами и
 * направляющими линиями, а не одним «└» в тексте — так глаз считывает
 * структуру каталога сразу.
 */
export default function CategoryNode({ node }: { node: CategoryTreeNode }) {
    const root = node.level === 1;

    return (
        <li>
            <Link
                href={`/admin/categories/${node.id}`}
                className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-sunk"
            >
                <span
                    className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        root ? "bg-accent" : "bg-line-strong",
                    )}
                />

                <span
                    className={cn(
                        "min-w-0 flex-1 truncate",
                        root
                            ? "text-sm font-semibold text-ink"
                            : "text-sm text-ink-soft",
                    )}
                >
                    {node.name}
                </span>

                <span className="hidden min-w-0 truncate font-mono text-[11px] text-ink-faint sm:block">
                    /{node.slug}
                </span>

                <span className="tnum w-20 shrink-0 text-right text-xs text-ink-faint">
                    {node.productCount > 0 ? `${node.productCount} items` : "—"}
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>

            {node.children.length > 0 && (
                <ul className="ml-[9px] border-l border-line-strong pl-4">
                    {node.children.map((child) => (
                        <CategoryNode key={child.id} node={child} />
                    ))}
                </ul>
            )}
        </li>
    );
}
