import Breadcrumb from "@/components/ui/Breadcrumb";
import CollectionBanner from "@/components/collections/CollectionBanner";
import FilterBar from "@/components/catalog/FilterBar";
import CatalogContainer from "@/components/catalog/CatalogContainer";
import {productsArray} from "@/mocks/catalogStore";
import Container from "@/components/layout/Сontainer";

const collections = [
    {
        slug: "o-deals",
        title: "O-Deals: 10% extra off",
        description: "On selected Spring styles – Code: O-DEAL",
        banner: null
    },
    {
        slug: "everything-summer",
        title: "Everything Summer",
        description: "From beach days to late sunset drinks",
        banner: "/banners/summer.jpg"
    }
]

export default async function CollectionPage({params}: { params: Promise<{ gender: string; collection: string }> }) {
    const { gender, collection } = await params;
    const data = collections.find(c => c.slug === collection)

    return (
        <Container>
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Breadcrumb className="py-2"/>
                        <CollectionBanner title={data?.title ?? "no title"}
                                          description={data?.description ?? "no desc"}/>
                    </div>
                    <div className="z-20">
                        <FilterBar/>
                    </div>
                </div>
                <CatalogContainer variant={"collection"} products={productsArray}/>
            </div>
        </Container>
    )
}