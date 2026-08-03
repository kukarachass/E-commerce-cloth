import { ListPageSkeleton } from "@/app/(admin)/admin/_components/ui/Skeleton";

export default function Loading() {
    return <ListPageSkeleton rows={9} withTabs />;
}
