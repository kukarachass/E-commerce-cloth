import {getProductList} from "@/lib/admin/queries/products";
import getCollectionProducts from "@/lib/admin/actions/collection-actions/getCollectionProducts";

interface Props{
    collectionId: string;
}
export default async function CollectionProductManager({ collectionId }){

    const collectionProducts = await getCollectionProducts(collectionId);
    return(
        <div className="flex flex-col gap-4">

        </div>
    )
}