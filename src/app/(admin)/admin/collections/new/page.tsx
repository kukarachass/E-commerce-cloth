import {requireAdmin} from "@/lib/admin/rbac";
import CollectionForm from "@/app/(admin)/admin/_components/collection/CollectionForm";

export default async function NewCollectionPage(){
    await requireAdmin();
    return(
        <div>
            <h1 className="text-xl mb-6">Новая коллекция</h1>
            <CollectionForm mode={"create"}/>
        </div>
    )
}