import Breadcrumb from "@/components/ui/Breadcrumb";
import CollectionBanner from "@/components/collections/CollectionBanner";
import FilterBar from "@/components/catalog/FilterBar";
import CatalogContainer from "@/components/catalog/CatalogContainer";
import {productsArray} from "@/mocks/catalogStore";
import Container from "@/components/layout/Сontainer";

export default function CollectionPage(){
    return(
        <Container>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Breadcrumb className="pb-4"/>
                        <CollectionBanner title={"Everything Summer"} description={"From beach days to late sunset drinks — this is your go-to summer edit."}/>
                    </div>
                    <FilterBar/>
                </div>
                <CatalogContainer variant={"collection"} products={productsArray}/>
            </div>
        </Container>
    )
}