import CatalogContainer from "@/components/catalog/CatalogContainer";
import {productsArray} from "@/mocks/catalogStore";

export default function AccessoriesPage(){
    return(
        <CatalogContainer products={productsArray}/>
    )
}