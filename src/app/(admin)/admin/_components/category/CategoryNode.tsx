import Link from "next/link";
import {CategoryTreeNode} from "@/lib/admin/queries/categories-operations/cat-types";

export default function CategoryNode({ node }: { node: CategoryTreeNode }) {
    return (
        <>
            <div
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-sm"
                style={{ paddingLeft: `${(node.level - 1) * 24 + 12}px` }}
            >
                {node.level > 1 && <span className="text-gray-300">└</span>}

                <Link
                    href={`/admin/categories/${node.id}`}
                    className="flex-1 hover:underline"
                >
                    {node.name}
                </Link>

                <span className="text-gray-400 text-xs">/{node.slug}</span>

                <span className="text-gray-500 text-xs w-20 text-right">
          {node.productCount > 0 ? `${node.productCount} тов.` : "—"}
        </span>
            </div>

            {node.children.map((child) => (
                <CategoryNode key={child.id} node={child} />
            ))}
        </>
    );
}