import CatalogContainer from "@/components/catalog/CatalogContainer";
import {productsArray} from "@/mocks/catalogStore";

export default function NewItemsPage() {
    return(
        <CatalogContainer products={productsArray}/>
    )
}