import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/lib/queryKeys";
import {getCategoryWithSubs} from "@/actions/category/categories";
import {useGender} from "@/hooks/useGender";

export function useGetCategoryWithSubs({ slug }: { slug: string }) {
    const gender = useGender();
    return useQuery({
        queryKey: queryKeys.subCats(gender, slug),
        queryFn: () => getCategoryWithSubs(gender, slug)
    })
}