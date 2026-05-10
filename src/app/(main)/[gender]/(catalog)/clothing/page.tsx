import CatalogContainer from "@/components/catalog/CatalogContainer";
import {productsArray} from "@/mocks/catalogStore";

export default function ClothingPage(){
    return(
        <CatalogContainer products={productsArray}/>
    )
}