export type CategoryTreeNode = {
    id: string;
    name: string;
    slug: string;
    gender: string;
    level: number;
    parentId: string | null;
    productCount: number;
    children: CategoryTreeNode[];
};

export type ParentOption = { id: string; name: string; level: number };
