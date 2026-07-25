import {useQuery} from "@tanstack/react-query";
import {isAdmin} from "@/lib/admin/rbac";

export default function useIsAdmin(){
    return useQuery({
        queryKey: ["admin"],
        queryFn: () => isAdmin()
    })
}