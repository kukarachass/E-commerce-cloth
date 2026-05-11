import EmptyCart from "@/components/cart/EmptyCart";
import Cart from "@/components/cart/Cart";
import ProductsRelated from "@/components/product/ProductsRelated";

export default function CartPage() {
    const cartItems = [
        {
            id: "1",
            brand: "Gucci",
            imgUrl: ["/product.webp", "/product2.webp", "/product3.webp", "product4.webp"],
            name: "Dolce Kabana",
            description: "Ahuenno super zaebis",
            price: 120,
            sizes: ["L", "M", "S", "XS", "XXS",],

            descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
            material: "Cotton Mix",
            careInstructions: "Please Follow The Care Instructions On The Care Label"
        },
        {
            id: "2",
            brand: "Gucci",
            imgUrl: ["/product.webp", "/product2.webp", "/product3.webp", "product4.webp"],
            name: "Dolce Kabana",
            description: "Ahuenno super zaebis",
            price: 120,
            sizes: ["L", "M", "S", "XS", "XXS",],

            descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
            material: "Cotton Mix",
            careInstructions: "Please Follow The Care Instructions On The Care Label"
        },{
            id: "312321",
            brand: "Gucci",
            imgUrl: ["/product.webp", "/product2.webp", "/product3.webp", "product4.webp"],
            name: "Dolce Kabana",
            description: "Ahuenno super zaebis",
            price: 120,
            sizes: ["L", "M", "S", "XS", "XXS",],

            descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
            material: "Cotton Mix",
            careInstructions: "Please Follow The Care Instructions On The Care Label"
        },{
            id: "3121",
            brand: "Gucci",
            imgUrl: ["/product.webp", "/product2.webp", "/product3.webp", "product4.webp"],
            name: "Dolce Kabana",
            description: "Ahuenno super zaebis",
            price: 120,
            sizes: ["L", "M", "S", "XS", "XXS",],

            descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
            material: "Cotton Mix",
            careInstructions: "Please Follow The Care Instructions On The Care Label"
        },
    ];

    return (
        <div className="w-full">
            <div className="max-w-[1200px] mx-auto py-10">
                {cartItems.length <= 0 ? (
                    <EmptyCart/>
                ): (
                    <div className="flex flex-col gap-4">
                        <Cart cartItems={cartItems} />
                        <ProductsRelated currentId={cartItems.map(i => i.id)} type={"related"} products={cartItems}/>
                    </div>
                )}
            </div>
        </div>
    )
}