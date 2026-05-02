import EmptyCart from "@/components/cart/EmptyCart";
import Cart from "@/components/cart/Cart";
import ProductsRelated from "@/components/product/ProductsRelated";

export default function CartPage() {
    const cartItems = [
        {id: 1, name: "Adidas", desc: "ORIGINALS ADICOLOR CLASSIC LOOSE TRACK TRACKSUIT BOTTOMS", size: "S", price: 230, imageUrl: "/cart-items/cart-item.webp"},
        {id: 2, name: "Levi's", desc: "ORIGINALS ADICOLOR CLASSIC LOOSE TRACK TRACKSUIT BOTTOMS", size: "S", price: 230, imageUrl: "/cart-items/cart-item-2.webp"},
        {id: 3, name: "Levi's", desc: "ORIGINALS ADICOLOR CLASSIC LOOSE TRACK TRACKSUIT BOTTOMS", size: "S", price: 230, imageUrl: "/cart-items/cart-item-3.webp"},
        {id: 4, name: "Michael Kors", desc: "ORIGINALS ADICOLOR CLASSIC LOOSE TRACK TRACKSUIT BOTTOMS", size: "S", price: 230, imageUrl: "/cart-items/cart-item-4.webp"},
        {id: 5, name: "Michael Kors", desc: "ORIGINALS ADICOLOR CLASSIC LOOSE TRACK TRACKSUIT BOTTOMS", size: "S", price: 230, imageUrl: "/cart-items/cart-item-4.webp"},
        {id: 6, name: "Michael Kors", desc: "ORIGINALS ADICOLOR CLASSIC LOOSE TRACK TRACKSUIT BOTTOMS", size: "S", price: 230, imageUrl: "/cart-items/cart-item-4.webp"},
    ];

    return (
        <div className="w-full">
            <div className="max-w-[1200px] mx-auto py-10">
                {cartItems.length <= 0 ? (
                    <EmptyCart/>
                ): (
                    <div className="flex flex-col gap-4">
                        <Cart cartItems={cartItems} />
                        <ProductsRelated products={cartItems}/>
                    </div>
                )}
            </div>
        </div>
    )
}