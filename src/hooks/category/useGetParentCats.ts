import {useGender} from "@/hooks/useGender";
import {useQuery} from "@tanstack/react-query";
import {queryKeys} from "@/lib/queryKeys";
import {getParentsCategories} from "@/actions/category/categories";

export default function useGetParentCats() {
    const gender = useGender();
    return useQuery({
        queryKey: queryKeys.parentCats(gender),
        queryFn: () => getParentsCategories({gender}),
        enabled: !!gender, // ← без этого запрос уйдёт с gender=undefined
    })
}