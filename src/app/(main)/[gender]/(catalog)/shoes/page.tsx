import CatalogContainer from "@/components/catalog/CatalogContainer";
import {productsArray} from "@/mocks/catalogStore";

export default function ShoesPage(){
    return(
        <CatalogContainer products={productsArray}/>

    )
}