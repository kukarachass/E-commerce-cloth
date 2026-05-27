import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { color, pattern, style, product, productSize, productColor, productPattern, productStyle, brand, category } from "@/db/schema"

// ============================================================
// СПРАВОЧНИКИ
// ============================================================

const colours = [
    { name: "Beige", hex: "#F5F0E8" },
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#4A7FD4" },
    { name: "Brown", hex: "#8B5E3C" },
    { name: "Gold", hex: "#D4A843" },
    { name: "Green", hex: "#4CAF82" },
    { name: "Grey", hex: "#B0B0B0" },
    { name: "Multicolour", hex: "#FF6B6B" },
    { name: "Orange", hex: "#FF9500" },
    { name: "Pink", hex: "#FFB3BA" },
    { name: "Purple", hex: "#9B6DD4" },
    { name: "Red", hex: "#E84343" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Yellow", hex: "#FFD43B" },
]

const patterns = [
    "Animal", "Camouflage", "Floral", "Geometric",
    "Paisley", "Polka Dot", "Striped", "Plaid", "Solid"
]

const styles = [
    "Business", "Casual", "Elegant", "Minimalism", "Evening"
]

// ============================================================
// ПРОДУКТЫ
// Структура: { name, slug, brandSlug, categorySlug, gender,
//   originalPrice, discountPrice, discount,
//   colors, patterns, styles, sizes }
// ============================================================

const productsData = [
    // ========================================================
    // WOMEN — CLOTHING
    // ========================================================

    // Coats
    { name: "Wool Blend Double-Breasted Coat", slug: "wool-blend-double-breasted-coat", brandSlug: "tommy-hilfiger", categorySlug: "women-clothing-coats", gender: "women", originalPrice: "299.00", discountPrice: "149.00", discount: 50, material: "80% Wool, 20% Polyester", colors: ["Beige", "Black"], patterns: ["Solid"], styles: ["Elegant", "Business"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }, { size: "XL", stock: 1 }] },
    { name: "Trench Coat Classic Fit", slug: "trench-coat-classic-fit", brandSlug: "calvin-klein", categorySlug: "women-clothing-coats", gender: "women", originalPrice: "349.00", discountPrice: "174.00", discount: 50, material: "Cotton Gabardine", colors: ["Beige", "Brown"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "XS", stock: 2 }, { size: "S", stock: 4 }, { size: "M", stock: 6 }, { size: "L", stock: 3 }] },
    { name: "Puffer Coat Oversized", slug: "puffer-coat-oversized", brandSlug: "the-north-face", categorySlug: "women-clothing-coats", gender: "women", originalPrice: "249.00", discountPrice: "99.00", discount: 60, material: "Recycled Polyester", colors: ["Black", "Pink", "Green"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 7 }, { size: "L", stock: 4 }, { size: "XL", stock: 2 }] },

    // Dresses
    { name: "Floral Wrap Midi Dress", slug: "floral-wrap-midi-dress", brandSlug: "scotch-and-soda", categorySlug: "women-clothing-dresses", gender: "women", originalPrice: "189.00", discountPrice: "79.00", discount: 58, material: "100% Viscose", colors: ["Blue", "Pink"], patterns: ["Floral"], styles: ["Casual", "Elegant"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "Satin Evening Slip Dress", slug: "satin-evening-slip-dress", brandSlug: "calvin-klein", categorySlug: "women-clothing-dresses", gender: "women", originalPrice: "229.00", discountPrice: "114.00", discount: 50, material: "100% Satin", colors: ["Black", "Beige", "Red"], patterns: ["Solid"], styles: ["Evening", "Elegant"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }] },
    { name: "Striped Cotton Shirt Dress", slug: "striped-cotton-shirt-dress", brandSlug: "tommy-hilfiger", categorySlug: "women-clothing-dresses", gender: "women", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "100% Cotton", colors: ["Blue", "White"], patterns: ["Striped"], styles: ["Casual"], sizes: [{ size: "S", stock: 6 }, { size: "M", stock: 7 }, { size: "L", stock: 4 }, { size: "XL", stock: 2 }] },

    // Jackets
    { name: "Denim Jacket Oversized", slug: "denim-jacket-oversized-women", brandSlug: "levis", categorySlug: "women-clothing-jackets", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "100% Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 8 }, { size: "M", stock: 6 }, { size: "L", stock: 3 }] },
    { name: "Leather Biker Jacket", slug: "leather-biker-jacket-women", brandSlug: "calvin-klein", categorySlug: "women-clothing-jackets", gender: "women", originalPrice: "399.00", discountPrice: "199.00", discount: 50, material: "Genuine Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "XS", stock: 2 }, { size: "S", stock: 4 }, { size: "M", stock: 3 }] },
    { name: "Blazer Single Button", slug: "blazer-single-button-women", brandSlug: "hugo-boss", categorySlug: "women-clothing-jackets", gender: "women", originalPrice: "279.00", discountPrice: "111.00", discount: 60, material: "Wool Blend", colors: ["Black", "Grey", "Beige"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }] },

    // Jeans
    { name: "High Rise Slim Jeans", slug: "high-rise-slim-jeans-women", brandSlug: "levis", categorySlug: "women-clothing-jeans", gender: "women", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "98% Cotton, 2% Elastane", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 5 }, { size: "26", stock: 4 }, { size: "27", stock: 6 }, { size: "28", stock: 5 }, { size: "29", stock: 3 }, { size: "30", stock: 2 }] },
    { name: "Straight Leg Jeans Raw", slug: "straight-leg-jeans-raw-women", brandSlug: "g-star-raw", categorySlug: "women-clothing-jeans", gender: "women", originalPrice: "149.00", discountPrice: "74.00", discount: 50, material: "100% Cotton Denim", colors: ["Blue", "Grey"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "25", stock: 4 }, { size: "26", stock: 5 }, { size: "27", stock: 6 }, { size: "28", stock: 4 }, { size: "30", stock: 2 }] },
    { name: "Flared Jeans 70s Style", slug: "flared-jeans-70s-style-women", brandSlug: "replay", categorySlug: "women-clothing-jeans", gender: "women", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "Cotton Blend", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "25", stock: 3 }, { size: "26", stock: 4 }, { size: "27", stock: 5 }, { size: "28", stock: 3 }] },

    // Jumpsuits
    { name: "Linen Wide Leg Jumpsuit", slug: "linen-wide-leg-jumpsuit", brandSlug: "scotch-and-soda", categorySlug: "women-clothing-jumpsuits", gender: "women", originalPrice: "179.00", discountPrice: "71.00", discount: 60, material: "100% Linen", colors: ["Beige", "White", "Black"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }] },
    { name: "Satin Utility Jumpsuit", slug: "satin-utility-jumpsuit", brandSlug: "calvin-klein", categorySlug: "women-clothing-jumpsuits", gender: "women", originalPrice: "199.00", discountPrice: "79.00", discount: 60, material: "Satin Polyester", colors: ["Black", "Green"], patterns: ["Solid"], styles: ["Evening", "Elegant"], sizes: [{ size: "XS", stock: 2 }, { size: "S", stock: 4 }, { size: "M", stock: 3 }] },
    { name: "Denim Shortall Jumpsuit", slug: "denim-shortall-jumpsuit", brandSlug: "levis", categorySlug: "women-clothing-jumpsuits", gender: "women", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "100% Cotton Denim", colors: ["Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },

    // Lingerie
    { name: "Lace Bralette Set", slug: "lace-bralette-set", brandSlug: "calvin-klein", categorySlug: "women-clothing-lingerie", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Nylon, Lace", colors: ["Black", "Pink", "White"], patterns: ["Solid"], styles: ["Elegant"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 6 }, { size: "M", stock: 4 }, { size: "L", stock: 3 }] },
    { name: "Silk Slip Camisole", slug: "silk-slip-camisole", brandSlug: "guess", categorySlug: "women-clothing-lingerie", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "100% Silk", colors: ["Beige", "Black", "Pink"], patterns: ["Solid"], styles: ["Elegant", "Minimalism"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }] },
    { name: "Cotton Comfort Brief Set 3pk", slug: "cotton-comfort-brief-set", brandSlug: "calvin-klein", categorySlug: "women-clothing-lingerie", gender: "women", originalPrice: "49.00", discountPrice: "24.00", discount: 51, material: "95% Cotton, 5% Elastane", colors: ["White", "Black", "Grey"], patterns: ["Solid"], styles: ["Minimalism"], sizes: [{ size: "XS", stock: 6 }, { size: "S", stock: 8 }, { size: "M", stock: 7 }, { size: "L", stock: 4 }] },

    // Nightwear
    { name: "Satin Pyjama Set", slug: "satin-pyjama-set-women", brandSlug: "guess", categorySlug: "women-clothing-nightwear", gender: "women", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "100% Satin", colors: ["Pink", "Black", "Beige"], patterns: ["Solid"], styles: ["Elegant"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "Flannel Check Pyjama", slug: "flannel-check-pyjama-women", brandSlug: "scotch-and-soda", categorySlug: "women-clothing-nightwear", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "100% Cotton Flannel", colors: ["Blue", "Pink", "Grey"], patterns: ["Plaid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 4 }] },
    { name: "Oversized Sleep Shirt", slug: "oversized-sleep-shirt-women", brandSlug: "calvin-klein", categorySlug: "women-clothing-nightwear", gender: "women", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "100% Cotton", colors: ["White", "Grey", "Black"], patterns: ["Solid"], styles: ["Minimalism", "Casual"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },

    // Shirts and Tops
    { name: "Poplin Button-Up Shirt", slug: "poplin-button-up-shirt-women", brandSlug: "tommy-hilfiger", categorySlug: "women-clothing-shirts-and-tops", gender: "women", originalPrice: "109.00", discountPrice: "43.00", discount: 61, material: "100% Cotton", colors: ["White", "Blue", "Pink"], patterns: ["Solid", "Striped"], styles: ["Business", "Casual"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "Ribbed Knit Tank Top", slug: "ribbed-knit-tank-top-women", brandSlug: "calvin-klein", categorySlug: "women-clothing-shirts-and-tops", gender: "women", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "Cotton Rib", colors: ["White", "Black", "Beige"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "XS", stock: 6 }, { size: "S", stock: 8 }, { size: "M", stock: 6 }, { size: "L", stock: 4 }] },
    { name: "Linen Cropped Top", slug: "linen-cropped-top-women", brandSlug: "scotch-and-soda", categorySlug: "women-clothing-shirts-and-tops", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "100% Linen", colors: ["Beige", "White", "Green"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 2 }] },

    // Skirts
    { name: "Pleated Midi Skirt", slug: "pleated-midi-skirt", brandSlug: "scotch-and-soda", categorySlug: "women-clothing-skirts", gender: "women", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Satin Polyester", colors: ["Beige", "Black", "Green"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }] },
    { name: "Denim Mini Skirt", slug: "denim-mini-skirt", brandSlug: "levis", categorySlug: "women-clothing-skirts", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "100% Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "Floral Print Wrap Skirt", slug: "floral-print-wrap-skirt", brandSlug: "guess", categorySlug: "women-clothing-skirts", gender: "women", originalPrice: "109.00", discountPrice: "43.00", discount: 61, material: "Viscose", colors: ["Pink", "Blue", "Green"], patterns: ["Floral"], styles: ["Casual", "Elegant"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }] },

    // Socks
    { name: "Ankle Socks 5 Pack", slug: "ankle-socks-5-pack-women", brandSlug: "adidas", categorySlug: "women-clothing-socks", gender: "women", originalPrice: "29.00", discountPrice: "14.00", discount: 52, material: "Cotton Blend", colors: ["White", "Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "35-38", stock: 10 }, { size: "39-42", stock: 8 }] },
    { name: "Knee High Knit Socks", slug: "knee-high-knit-socks-women", brandSlug: "scotch-and-soda", categorySlug: "women-clothing-socks", gender: "women", originalPrice: "39.00", discountPrice: "15.00", discount: 62, material: "Wool Blend", colors: ["Grey", "Beige", "Black"], patterns: ["Striped", "Solid"], styles: ["Casual"], sizes: [{ size: "35-38", stock: 8 }, { size: "39-42", stock: 6 }] },
    { name: "No-Show Socks 3 Pack", slug: "no-show-socks-3-pack-women", brandSlug: "nike", categorySlug: "women-clothing-socks", gender: "women", originalPrice: "19.00", discountPrice: "9.00", discount: 53, material: "Cotton Blend", colors: ["White", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "35-38", stock: 12 }, { size: "39-42", stock: 10 }] },

    // Sweaters and Cardigans
    { name: "Cable Knit Oversized Sweater", slug: "cable-knit-oversized-sweater-women", brandSlug: "tommy-hilfiger", categorySlug: "women-clothing-sweaters-and-cardigans", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Wool Blend", colors: ["Beige", "White", "Grey"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "Open Front Cardigan", slug: "open-front-cardigan-women", brandSlug: "scotch-and-soda", categorySlug: "women-clothing-sweaters-and-cardigans", gender: "women", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Knit Cotton", colors: ["Black", "Beige", "Green"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }] },
    { name: "Turtleneck Ribbed Sweater", slug: "turtleneck-ribbed-sweater-women", brandSlug: "calvin-klein", categorySlug: "women-clothing-sweaters-and-cardigans", gender: "women", originalPrice: "119.00", discountPrice: "47.00", discount: 61, material: "Cotton Rib", colors: ["Black", "White", "Beige"], patterns: ["Solid"], styles: ["Minimalism", "Casual"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },

    // Swimwear
    { name: "Triangle Bikini Set", slug: "triangle-bikini-set-women", brandSlug: "guess", categorySlug: "women-clothing-swimwear", gender: "women", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Polyamide Blend", colors: ["Black", "Blue", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "One Piece Swimsuit Ribbed", slug: "one-piece-swimsuit-ribbed", brandSlug: "calvin-klein", categorySlug: "women-clothing-swimwear", gender: "women", originalPrice: "119.00", discountPrice: "47.00", discount: 61, material: "Nylon Blend", colors: ["Black", "Green", "Beige"], patterns: ["Solid"], styles: ["Minimalism", "Elegant"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 2 }] },
    { name: "High Waist Bikini Bottom", slug: "high-waist-bikini-bottom", brandSlug: "lacoste", categorySlug: "women-clothing-swimwear", gender: "women", originalPrice: "69.00", discountPrice: "27.00", discount: 61, material: "Polyamide", colors: ["White", "Black", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },

    // Trousers
    { name: "Wide Leg Linen Trousers", slug: "wide-leg-linen-trousers-women", brandSlug: "scotch-and-soda", categorySlug: "women-clothing-trousers", gender: "women", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "100% Linen", colors: ["Beige", "White", "Black"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "Tailored Slim Trousers", slug: "tailored-slim-trousers-women", brandSlug: "hugo-boss", categorySlug: "women-clothing-trousers", gender: "women", originalPrice: "199.00", discountPrice: "79.00", discount: 60, material: "Wool Blend", colors: ["Black", "Grey", "Navy"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }] },
    { name: "Jogger Pants Relaxed", slug: "jogger-pants-relaxed-women", brandSlug: "adidas", categorySlug: "women-clothing-trousers", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Cotton French Terry", colors: ["Grey", "Black", "Green"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 6 }, { size: "M", stock: 6 }, { size: "L", stock: 4 }] },

    // ========================================================
    // WOMEN — SPORTSWEAR
    // ========================================================

    // Skiwear
    { name: "Insulated Ski Jacket Women", slug: "insulated-ski-jacket-women", brandSlug: "the-north-face", categorySlug: "women-sportswear-skiwear", gender: "women", originalPrice: "499.00", discountPrice: "199.00", discount: 60, material: "Recycled Polyester", colors: ["Black", "Blue", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 4 }, { size: "M", stock: 4 }, { size: "L", stock: 2 }] },
    { name: "Ski Bib Pants Women", slug: "ski-bib-pants-women", brandSlug: "the-north-face", categorySlug: "women-sportswear-skiwear", gender: "women", originalPrice: "349.00", discountPrice: "139.00", discount: 60, material: "Waterproof Polyester", colors: ["Black", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 3 }, { size: "S", stock: 4 }, { size: "M", stock: 3 }, { size: "L", stock: 2 }] },
    { name: "Thermal Base Layer Set Women", slug: "thermal-base-layer-set-women", brandSlug: "the-north-face", categorySlug: "women-sportswear-skiwear", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Merino Wool Blend", colors: ["Black", "Grey", "Beige"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 5 }, { size: "M", stock: 4 }, { size: "L", stock: 3 }] },

    // Sports Accessories
    { name: "Running Belt Waistpack", slug: "running-belt-waistpack-women", brandSlug: "nike", categorySlug: "women-sportswear-sports-accessories", gender: "women", originalPrice: "39.00", discountPrice: "15.00", discount: 62, material: "Nylon", colors: ["Black", "Pink", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 15 }] },
    { name: "Sports Water Bottle 750ml", slug: "sports-water-bottle-750ml-women", brandSlug: "adidas", categorySlug: "women-sportswear-sports-accessories", gender: "women", originalPrice: "29.00", discountPrice: "14.00", discount: 52, material: "BPA-Free Plastic", colors: ["Black", "Blue", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 20 }] },
    { name: "Yoga Mat Non-Slip", slug: "yoga-mat-non-slip-women", brandSlug: "adidas", categorySlug: "women-sportswear-sports-accessories", gender: "women", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "TPE Foam", colors: ["Pink", "Purple", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 10 }] },

    // Sports Clothing & Apparel
    { name: "Compression Leggings 7/8", slug: "compression-leggings-78-women", brandSlug: "nike", categorySlug: "women-sportswear-sports-clothing-and-apparel", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Nylon Blend", colors: ["Black", "Grey", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 6 }, { size: "S", stock: 8 }, { size: "M", stock: 7 }, { size: "L", stock: 4 }] },
    { name: "Sports Bra Medium Support", slug: "sports-bra-medium-support-women", brandSlug: "adidas", categorySlug: "women-sportswear-sports-clothing-and-apparel", gender: "women", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "Polyester Blend", colors: ["Black", "Pink", "White"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 5 }, { size: "S", stock: 7 }, { size: "M", stock: 6 }, { size: "L", stock: 4 }] },
    { name: "Oversized Training Hoodie", slug: "oversized-training-hoodie-women", brandSlug: "puma", categorySlug: "women-sportswear-sports-clothing-and-apparel", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Cotton Blend", colors: ["Grey", "Black", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "XS", stock: 4 }, { size: "S", stock: 6 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },

    // Sports Shoes
    { name: "Running Shoes Air Zoom Women", slug: "running-shoes-air-zoom-women", brandSlug: "nike", categorySlug: "women-sportswear-sports-shoes", gender: "women", originalPrice: "149.00", discountPrice: "74.00", discount: 50, material: "Mesh Upper", colors: ["White", "Black", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 5 }, { size: "38", stock: 6 }, { size: "39", stock: 4 }, { size: "40", stock: 2 }] },
    { name: "Training Shoes Ultraboost Women", slug: "training-shoes-ultraboost-women", brandSlug: "adidas", categorySlug: "women-sportswear-sports-shoes", gender: "women", originalPrice: "179.00", discountPrice: "89.00", discount: 50, material: "Primeknit Upper", colors: ["Black", "White", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 5 }, { size: "39", stock: 4 }, { size: "40", stock: 3 }] },
    { name: "CrossFit Training Shoes Women", slug: "crossfit-training-shoes-women", brandSlug: "puma", categorySlug: "women-sportswear-sports-shoes", gender: "women", originalPrice: "119.00", discountPrice: "47.00", discount: 61, material: "Synthetic Upper", colors: ["Black", "Pink", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 5 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },

    // ========================================================
    // WOMEN — SHOES
    // ========================================================

    // Ballerina Shoes
    { name: "Classic Leather Ballerina", slug: "classic-leather-ballerina", brandSlug: "lacoste", categorySlug: "women-shoes-ballerina-shoes", gender: "women", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Genuine Leather", colors: ["Black", "Beige", "White"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },
    { name: "Bow Detail Ballet Flat", slug: "bow-detail-ballet-flat", brandSlug: "guess", categorySlug: "women-shoes-ballerina-shoes", gender: "women", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Synthetic", colors: ["Pink", "Black", "Beige"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }] },
    { name: "Pointed Toe Ballerina", slug: "pointed-toe-ballerina", brandSlug: "calvin-klein", categorySlug: "women-shoes-ballerina-shoes", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Leather", colors: ["Black", "Beige"], patterns: ["Solid"], styles: ["Elegant", "Business"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },

    // Boots
    { name: "Ankle Chelsea Boots Women", slug: "ankle-chelsea-boots-women", brandSlug: "calvin-klein", categorySlug: "women-shoes-boots", gender: "women", originalPrice: "199.00", discountPrice: "79.00", discount: 60, material: "Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },
    { name: "Over The Knee Boots Women", slug: "over-the-knee-boots-women", brandSlug: "guess", categorySlug: "women-shoes-boots", gender: "women", originalPrice: "249.00", discountPrice: "99.00", discount: 60, material: "Faux Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "36", stock: 2 }, { size: "37", stock: 3 }, { size: "38", stock: 3 }, { size: "39", stock: 2 }] },
    { name: "Combat Lace-Up Boots Women", slug: "combat-lace-up-boots-women", brandSlug: "vans", categorySlug: "women-shoes-boots", gender: "women", originalPrice: "179.00", discountPrice: "71.00", discount: 60, material: "Leather Upper", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 4 }, { size: "38", stock: 5 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },

    // Brogues
    { name: "Oxford Leather Brogues Women", slug: "oxford-leather-brogues-women", brandSlug: "hugo-boss", categorySlug: "women-shoes-brogues", gender: "women", originalPrice: "229.00", discountPrice: "91.00", discount: 60, material: "Full Grain Leather", colors: ["Brown", "Black"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }] },
    { name: "Wingtip Brogue Shoes Women", slug: "wingtip-brogue-shoes-women", brandSlug: "lacoste", categorySlug: "women-shoes-brogues", gender: "women", originalPrice: "189.00", discountPrice: "75.00", discount: 60, material: "Leather", colors: ["Brown", "Beige"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }] },
    { name: "Suede Brogue Platform Women", slug: "suede-brogue-platform-women", brandSlug: "scotch-and-soda", categorySlug: "women-shoes-brogues", gender: "women", originalPrice: "169.00", discountPrice: "67.00", discount: 60, material: "Suede", colors: ["Brown", "Black", "Beige"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 4 }, { size: "38", stock: 5 }, { size: "39", stock: 3 }] },

    // Espadrilles
    { name: "Canvas Espadrille Wedge", slug: "canvas-espadrille-wedge-women", brandSlug: "lacoste", categorySlug: "women-shoes-espadrilles", gender: "women", originalPrice: "109.00", discountPrice: "43.00", discount: 61, material: "Canvas Upper", colors: ["Beige", "White", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 5 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },
    { name: "Stripe Jute Espadrilles", slug: "stripe-jute-espadrilles-women", brandSlug: "scotch-and-soda", categorySlug: "women-shoes-espadrilles", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Jute and Canvas", colors: ["Blue", "White", "Beige"], patterns: ["Striped"], styles: ["Casual"], sizes: [{ size: "36", stock: 5 }, { size: "37", stock: 6 }, { size: "38", stock: 5 }, { size: "39", stock: 4 }] },
    { name: "Slip-On Flat Espadrilles", slug: "slip-on-flat-espadrilles-women", brandSlug: "lacoste", categorySlug: "women-shoes-espadrilles", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Canvas", colors: ["Black", "Beige", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 5 }, { size: "37", stock: 6 }, { size: "38", stock: 5 }, { size: "39", stock: 4 }, { size: "40", stock: 2 }] },

    // Loafers
    { name: "Leather Penny Loafer Women", slug: "leather-penny-loafer-women", brandSlug: "hugo-boss", categorySlug: "women-shoes-loafers", gender: "women", originalPrice: "219.00", discountPrice: "87.00", discount: 60, material: "Full Grain Leather", colors: ["Black", "Brown", "Beige"], patterns: ["Solid"], styles: ["Business", "Elegant", "Casual"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },
    { name: "Horsebit Chain Loafer Women", slug: "horsebit-chain-loafer-women", brandSlug: "guess", categorySlug: "women-shoes-loafers", gender: "women", originalPrice: "189.00", discountPrice: "75.00", discount: 60, material: "Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Elegant", "Business"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }] },
    { name: "Platform Loafer Chunky Women", slug: "platform-loafer-chunky-women", brandSlug: "scotch-and-soda", categorySlug: "women-shoes-loafers", gender: "women", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "Faux Leather", colors: ["Black", "Brown", "White"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 5 }, { size: "39", stock: 3 }] },

    // Mules
    { name: "Suede Slide Mule Women", slug: "suede-slide-mule-women", brandSlug: "calvin-klein", categorySlug: "women-shoes-mules", gender: "women", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "Suede", colors: ["Beige", "Black", "Grey"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 5 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },
    { name: "Block Heel Mule Women", slug: "block-heel-mule-women", brandSlug: "guess", categorySlug: "women-shoes-mules", gender: "women", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "Leather Upper", colors: ["Black", "Beige", "White"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 5 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }] },
    { name: "Pointed Toe Mule Flat", slug: "pointed-toe-mule-flat-women", brandSlug: "lacoste", categorySlug: "women-shoes-mules", gender: "women", originalPrice: "119.00", discountPrice: "47.00", discount: 61, material: "Leather", colors: ["Beige", "Black"], patterns: ["Solid"], styles: ["Elegant", "Minimalism"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },

    // Pumps
    { name: "Classic Stiletto Pump Women", slug: "classic-stiletto-pump-women", brandSlug: "guess", categorySlug: "women-shoes-pumps", gender: "women", originalPrice: "169.00", discountPrice: "67.00", discount: 60, material: "Leather", colors: ["Black", "Beige", "Red"], patterns: ["Solid"], styles: ["Elegant", "Business"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },
    { name: "Block Heel Pump Round Toe", slug: "block-heel-pump-round-toe", brandSlug: "calvin-klein", categorySlug: "women-shoes-pumps", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Leather Upper", colors: ["Black", "Beige", "White"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 5 }, { size: "38", stock: 5 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },
    { name: "Slingback Kitten Heel Pump", slug: "slingback-kitten-heel-pump", brandSlug: "hugo-boss", categorySlug: "women-shoes-pumps", gender: "women", originalPrice: "199.00", discountPrice: "79.00", discount: 60, material: "Suede", colors: ["Beige", "Black", "Pink"], patterns: ["Solid"], styles: ["Elegant", "Business"], sizes: [{ size: "36", stock: 3 }, { size: "37", stock: 4 }, { size: "38", stock: 4 }, { size: "39", stock: 3 }] },

    // Sandals
    { name: "Leather Strappy Sandal Women", slug: "leather-strappy-sandal-women", brandSlug: "lacoste", categorySlug: "women-shoes-sandals", gender: "women", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Genuine Leather", colors: ["Beige", "Brown", "Black"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 5 }, { size: "39", stock: 4 }, { size: "40", stock: 2 }] },
    { name: "Platform Sandal Cork Sole", slug: "platform-sandal-cork-sole", brandSlug: "scotch-and-soda", categorySlug: "women-shoes-sandals", gender: "women", originalPrice: "109.00", discountPrice: "43.00", discount: 61, material: "Leather and Cork", colors: ["Brown", "Beige"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 5 }, { size: "39", stock: 3 }, { size: "40", stock: 2 }] },
    { name: "Toe Post Flat Sandal Women", slug: "toe-post-flat-sandal-women", brandSlug: "calvin-klein", categorySlug: "women-shoes-sandals", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Synthetic Leather", colors: ["Black", "White", "Beige"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "36", stock: 5 }, { size: "37", stock: 6 }, { size: "38", stock: 5 }, { size: "39", stock: 4 }, { size: "40", stock: 2 }] },

    // Slippers & Flip Flops
    { name: "Fluffy Faux Fur Slippers Women", slug: "fluffy-faux-fur-slippers-women", brandSlug: "guess", categorySlug: "women-shoes-slippers-and-flip-flops", gender: "women", originalPrice: "49.00", discountPrice: "19.00", discount: 61, material: "Faux Fur", colors: ["Pink", "Beige", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36-37", stock: 6 }, { size: "38-39", stock: 6 }, { size: "40-41", stock: 4 }] },
    { name: "Classic Flip Flops Women", slug: "classic-flip-flops-women", brandSlug: "adidas", categorySlug: "women-shoes-slippers-and-flip-flops", gender: "women", originalPrice: "35.00", discountPrice: "17.00", discount: 51, material: "EVA Foam", colors: ["Black", "White", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 8 }, { size: "37", stock: 8 }, { size: "38", stock: 7 }, { size: "39", stock: 6 }, { size: "40", stock: 4 }] },
    { name: "Memory Foam House Slippers", slug: "memory-foam-house-slippers-women", brandSlug: "puma", categorySlug: "women-shoes-slippers-and-flip-flops", gender: "women", originalPrice: "55.00", discountPrice: "27.00", discount: 51, material: "Memory Foam", colors: ["Grey", "Pink", "Beige"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36-37", stock: 6 }, { size: "38-39", stock: 7 }, { size: "40-41", stock: 4 }] },

    // Trainers
    { name: "Air Max Classic Women", slug: "air-max-classic-women", brandSlug: "nike", categorySlug: "women-shoes-trainers", gender: "women", originalPrice: "159.00", discountPrice: "79.00", discount: 50, material: "Mesh and Leather", colors: ["White", "Black", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 4 }, { size: "37", stock: 5 }, { size: "38", stock: 6 }, { size: "39", stock: 4 }, { size: "40", stock: 3 }] },
    { name: "Superstar Sneaker Women", slug: "superstar-sneaker-women", brandSlug: "adidas", categorySlug: "women-shoes-trainers", gender: "women", originalPrice: "139.00", discountPrice: "69.00", discount: 50, material: "Leather Upper", colors: ["White", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 5 }, { size: "37", stock: 6 }, { size: "38", stock: 6 }, { size: "39", stock: 4 }, { size: "40", stock: 3 }] },
    { name: "Old Skool Canvas Trainers Women", slug: "old-skool-canvas-trainers-women", brandSlug: "vans", categorySlug: "women-shoes-trainers", gender: "women", originalPrice: "99.00", discountPrice: "49.00", discount: 50, material: "Canvas and Suede", colors: ["Black", "White", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "36", stock: 5 }, { size: "37", stock: 6 }, { size: "38", stock: 6 }, { size: "39", stock: 4 }, { size: "40", stock: 3 }] },

    // ========================================================
    // WOMEN — ACCESSORIES
    // ========================================================

    // Bags
    { name: "Leather Tote Bag Women", slug: "leather-tote-bag-women", brandSlug: "calvin-klein", categorySlug: "women-accessories-bags", gender: "women", originalPrice: "249.00", discountPrice: "99.00", discount: 60, material: "Genuine Leather", colors: ["Black", "Brown", "Beige"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Mini Crossbody Bag Women", slug: "mini-crossbody-bag-women", brandSlug: "guess", categorySlug: "women-accessories-bags", gender: "women", originalPrice: "179.00", discountPrice: "71.00", discount: 60, material: "Faux Leather", colors: ["Black", "Pink", "Beige"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Canvas Shopper Tote", slug: "canvas-shopper-tote-women", brandSlug: "lacoste", categorySlug: "women-accessories-bags", gender: "women", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Canvas", colors: ["Beige", "Black", "Green"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 12 }] },

    // Belts
    { name: "Leather Belt Women", slug: "leather-belt-women", brandSlug: "calvin-klein", categorySlug: "women-accessories-belts", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Genuine Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "S", stock: 6 }, { size: "M", stock: 6 }, { size: "L", stock: 4 }] },
    { name: "Wide Woven Belt Women", slug: "wide-woven-belt-women", brandSlug: "scotch-and-soda", categorySlug: "women-accessories-belts", gender: "women", originalPrice: "69.00", discountPrice: "27.00", discount: 61, material: "Woven Textile", colors: ["Beige", "Black", "Brown"], patterns: ["Plaid"], styles: ["Casual", "Elegant"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "Chain Link Belt Women", slug: "chain-link-belt-women", brandSlug: "guess", categorySlug: "women-accessories-belts", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Metal", colors: ["Gold", "Silver"], patterns: ["Solid"], styles: ["Elegant"], sizes: [{ size: "One Size", stock: 8 }] },

    // Gloves
    { name: "Leather Gloves Women", slug: "leather-gloves-women", brandSlug: "tommy-hilfiger", categorySlug: "women-accessories-gloves", gender: "women", originalPrice: "69.00", discountPrice: "27.00", discount: 61, material: "Genuine Leather", colors: ["Black", "Brown", "Beige"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 5 }, { size: "L", stock: 3 }] },
    { name: "Knit Winter Gloves Women", slug: "knit-winter-gloves-women", brandSlug: "scotch-and-soda", categorySlug: "women-accessories-gloves", gender: "women", originalPrice: "49.00", discountPrice: "19.00", discount: 61, material: "Wool Blend", colors: ["Grey", "Black", "Beige"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Touchscreen Compatible Gloves Women", slug: "touchscreen-gloves-women", brandSlug: "the-north-face", categorySlug: "women-accessories-gloves", gender: "women", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "Fleece", colors: ["Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S-M", stock: 8 }, { size: "L-XL", stock: 6 }] },

    // Hair Accessories
    { name: "Satin Scrunchie Set Women", slug: "satin-scrunchie-set-women", brandSlug: "scotch-and-soda", categorySlug: "women-accessories-hair-accessories", gender: "women", originalPrice: "29.00", discountPrice: "14.00", discount: 52, material: "Satin", colors: ["Black", "Pink", "Beige"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 15 }] },
    { name: "Velvet Headband Women", slug: "velvet-headband-women", brandSlug: "guess", categorySlug: "women-accessories-hair-accessories", gender: "women", originalPrice: "39.00", discountPrice: "15.00", discount: 62, material: "Velvet", colors: ["Black", "Pink", "Green"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 12 }] },
    { name: "Pearl Hair Clip Set Women", slug: "pearl-hair-clip-set-women", brandSlug: "scotch-and-soda", categorySlug: "women-accessories-hair-accessories", gender: "women", originalPrice: "35.00", discountPrice: "17.00", discount: 51, material: "Metal and Pearl", colors: ["Gold", "Silver", "White"], patterns: ["Solid"], styles: ["Elegant"], sizes: [{ size: "One Size", stock: 12 }] },

    // Hats & Caps
    { name: "Wool Fedora Hat Women", slug: "wool-fedora-hat-women", brandSlug: "scotch-and-soda", categorySlug: "women-accessories-hats-and-caps", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Wool Felt", colors: ["Black", "Beige", "Brown"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Baseball Cap Women", slug: "baseball-cap-women", brandSlug: "adidas", categorySlug: "women-accessories-hats-and-caps", gender: "women", originalPrice: "39.00", discountPrice: "15.00", discount: 62, material: "Cotton Twill", colors: ["Black", "White", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Knit Beanie Women", slug: "knit-beanie-women", brandSlug: "the-north-face", categorySlug: "women-accessories-hats-and-caps", gender: "women", originalPrice: "49.00", discountPrice: "24.00", discount: 51, material: "Acrylic Knit", colors: ["Grey", "Black", "Beige", "Pink"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 12 }] },

    // Jewellery & Watches
    { name: "Gold Hoop Earrings Set Women", slug: "gold-hoop-earrings-set-women", brandSlug: "guess", categorySlug: "women-accessories-jewellery-and-watches", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Gold-Plated Metal", colors: ["Gold"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Minimalist Watch Women", slug: "minimalist-watch-women", brandSlug: "calvin-klein", categorySlug: "women-accessories-jewellery-and-watches", gender: "women", originalPrice: "249.00", discountPrice: "99.00", discount: 60, material: "Stainless Steel", colors: ["Silver", "Gold"], patterns: ["Solid"], styles: ["Minimalism", "Business"], sizes: [{ size: "One Size", stock: 6 }] },
    { name: "Layered Necklace Set Women", slug: "layered-necklace-set-women", brandSlug: "guess", categorySlug: "women-accessories-jewellery-and-watches", gender: "women", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Gold-Plated", colors: ["Gold", "Silver"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 10 }] },

    // Scarves
    { name: "Silk Square Scarf Women", slug: "silk-square-scarf-women", brandSlug: "tommy-hilfiger", categorySlug: "women-accessories-scarves", gender: "women", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "100% Silk", colors: ["Multicolour", "Blue", "Pink"], patterns: ["Floral", "Geometric"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Cashmere Blend Scarf Women", slug: "cashmere-blend-scarf-women", brandSlug: "scotch-and-soda", categorySlug: "women-accessories-scarves", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Cashmere Blend", colors: ["Beige", "Grey", "Black"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Lightweight Linen Scarf Women", slug: "lightweight-linen-scarf-women", brandSlug: "lacoste", categorySlug: "women-accessories-scarves", gender: "women", originalPrice: "69.00", discountPrice: "27.00", discount: 61, material: "100% Linen", colors: ["White", "Beige", "Blue"], patterns: ["Solid", "Striped"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 10 }] },

    // Sunglasses
    { name: "Oversized Cat Eye Sunglasses Women", slug: "oversized-cat-eye-sunglasses-women", brandSlug: "guess", categorySlug: "women-accessories-sunglasses", gender: "women", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Acetate", colors: ["Black", "Brown", "Pink"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Round Retro Sunglasses Women", slug: "round-retro-sunglasses-women", brandSlug: "lacoste", categorySlug: "women-accessories-sunglasses", gender: "women", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Metal Frame", colors: ["Gold", "Silver"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Square Frame Sunglasses Women", slug: "square-frame-sunglasses-women", brandSlug: "calvin-klein", categorySlug: "women-accessories-sunglasses", gender: "women", originalPrice: "169.00", discountPrice: "67.00", discount: 60, material: "Acetate", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Minimalism", "Business"], sizes: [{ size: "One Size", stock: 8 }] },

    // Tech Accessories
    { name: "Leather Phone Case Women", slug: "leather-phone-case-women", brandSlug: "calvin-klein", categorySlug: "women-accessories-tech-accessories", gender: "women", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "Genuine Leather", colors: ["Black", "Beige", "Pink"], patterns: ["Solid"], styles: ["Minimalism", "Elegant"], sizes: [{ size: "One Size", stock: 12 }] },
    { name: "AirPods Case Cover Women", slug: "airpods-case-cover-women", brandSlug: "guess", categorySlug: "women-accessories-tech-accessories", gender: "women", originalPrice: "39.00", discountPrice: "15.00", discount: 62, material: "Silicone", colors: ["Pink", "Black", "White"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 15 }] },
    { name: "Laptop Sleeve 13inch Women", slug: "laptop-sleeve-13inch-women", brandSlug: "the-north-face", categorySlug: "women-accessories-tech-accessories", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Neoprene", colors: ["Black", "Grey", "Pink"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "13 inch", stock: 8 }, { size: "15 inch", stock: 6 }] },

    // Wallets & Cardholders
    { name: "Zip Around Wallet Women", slug: "zip-around-wallet-women", brandSlug: "calvin-klein", categorySlug: "women-accessories-wallets-and-cardholders", gender: "women", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Genuine Leather", colors: ["Black", "Brown", "Beige"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Slim Card Holder Women", slug: "slim-card-holder-women", brandSlug: "hugo-boss", categorySlug: "women-accessories-wallets-and-cardholders", gender: "women", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Full Grain Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Minimalism"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Wristlet Clutch Women", slug: "wristlet-clutch-women", brandSlug: "guess", categorySlug: "women-accessories-wallets-and-cardholders", gender: "women", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Faux Leather", colors: ["Black", "Pink", "Beige"], patterns: ["Solid"], styles: ["Elegant", "Casual"], sizes: [{ size: "One Size", stock: 8 }] },

    // ========================================================
    // MEN — CLOTHING
    // ========================================================

    // Coats
    { name: "Wool Overcoat Men", slug: "wool-overcoat-men", brandSlug: "hugo-boss", categorySlug: "men-clothing-coats", gender: "men", originalPrice: "399.00", discountPrice: "159.00", discount: 60, material: "Wool Blend", colors: ["Black", "Grey", "Beige"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "S", stock: 3 }, { size: "M", stock: 4 }, { size: "L", stock: 4 }, { size: "XL", stock: 2 }] },
    { name: "Trench Coat Men Classic", slug: "trench-coat-men-classic", brandSlug: "tommy-hilfiger", categorySlug: "men-clothing-coats", gender: "men", originalPrice: "349.00", discountPrice: "139.00", discount: 60, material: "Cotton Gabardine", colors: ["Beige", "Brown"], patterns: ["Solid"], styles: ["Elegant", "Business"], sizes: [{ size: "S", stock: 3 }, { size: "M", stock: 4 }, { size: "L", stock: 3 }, { size: "XL", stock: 2 }] },
    { name: "Parka Jacket Men", slug: "parka-jacket-men", brandSlug: "the-north-face", categorySlug: "men-clothing-coats", gender: "men", originalPrice: "299.00", discountPrice: "119.00", discount: 60, material: "Nylon Shell", colors: ["Black", "Green", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }, { size: "XL", stock: 2 }] },

    // Jackets
    { name: "Bomber Jacket Men", slug: "bomber-jacket-men", brandSlug: "adidas", categorySlug: "men-clothing-jackets", gender: "men", originalPrice: "169.00", discountPrice: "67.00", discount: 60, material: "Nylon", colors: ["Black", "Green", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }, { size: "XL", stock: 2 }] },
    { name: "Denim Jacket Men", slug: "denim-jacket-men", brandSlug: "levis", categorySlug: "men-clothing-jackets", gender: "men", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Cotton Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Blazer Slim Fit Men", slug: "blazer-slim-fit-men", brandSlug: "hugo-boss", categorySlug: "men-clothing-jackets", gender: "men", originalPrice: "299.00", discountPrice: "119.00", discount: 60, material: "Wool Blend", colors: ["Black", "Grey", "Navy"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "S", stock: 3 }, { size: "M", stock: 4 }, { size: "L", stock: 4 }, { size: "XL", stock: 2 }] },

    // Jeans
    { name: "Slim Fit Jeans Men", slug: "slim-fit-jeans-men", brandSlug: "levis", categorySlug: "men-clothing-jeans", gender: "men", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Cotton Denim", colors: ["Blue", "Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 4 }, { size: "30", stock: 5 }, { size: "32", stock: 6 }, { size: "34", stock: 5 }, { size: "36", stock: 3 }] },
    { name: "Straight Raw Denim Jeans Men", slug: "straight-raw-denim-jeans-men", brandSlug: "g-star-raw", categorySlug: "men-clothing-jeans", gender: "men", originalPrice: "159.00", discountPrice: "79.00", discount: 50, material: "Raw Denim", colors: ["Blue", "Black"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 5 }, { size: "32", stock: 6 }, { size: "34", stock: 5 }, { size: "36", stock: 3 }] },
    { name: "Relaxed Fit Jeans Men", slug: "relaxed-fit-jeans-men", brandSlug: "replay", categorySlug: "men-clothing-jeans", gender: "men", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Cotton Blend", colors: ["Blue", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 5 }, { size: "32", stock: 6 }, { size: "34", stock: 4 }, { size: "36", stock: 2 }] },

    // Nightwear
    { name: "Flannel Pyjama Set Men", slug: "flannel-pyjama-set-men", brandSlug: "tommy-hilfiger", categorySlug: "men-clothing-nightwear", gender: "men", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Cotton Flannel", colors: ["Blue", "Grey", "Brown"], patterns: ["Plaid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Jersey Lounge Set Men", slug: "jersey-lounge-set-men", brandSlug: "calvin-klein", categorySlug: "men-clothing-nightwear", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Cotton Jersey", colors: ["Grey", "Black", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Sleep Shorts Men", slug: "sleep-shorts-men", brandSlug: "calvin-klein", categorySlug: "men-clothing-nightwear", gender: "men", originalPrice: "49.00", discountPrice: "19.00", discount: 61, material: "Woven Cotton", colors: ["Grey", "Black", "Blue"], patterns: ["Solid", "Plaid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },

    // Shirts
    { name: "Oxford Button Down Shirt Men", slug: "oxford-button-down-shirt-men", brandSlug: "tommy-hilfiger", categorySlug: "men-clothing-shirts", gender: "men", originalPrice: "119.00", discountPrice: "47.00", discount: 61, material: "Cotton Oxford", colors: ["White", "Blue", "Pink"], patterns: ["Solid", "Striped"], styles: ["Business", "Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Linen Shirt Men Summer", slug: "linen-shirt-men-summer", brandSlug: "scotch-and-soda", categorySlug: "men-clothing-shirts", gender: "men", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "100% Linen", colors: ["White", "Beige", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Flannel Check Shirt Men", slug: "flannel-check-shirt-men", brandSlug: "levis", categorySlug: "men-clothing-shirts", gender: "men", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Cotton Flannel", colors: ["Blue", "Red", "Grey"], patterns: ["Plaid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },

    // Suits
    { name: "Two-Piece Slim Fit Suit Men", slug: "two-piece-slim-fit-suit-men", brandSlug: "hugo-boss", categorySlug: "men-clothing-suits", gender: "men", originalPrice: "599.00", discountPrice: "299.00", discount: 50, material: "Wool Blend", colors: ["Black", "Navy", "Grey"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "S", stock: 2 }, { size: "M", stock: 3 }, { size: "L", stock: 3 }, { size: "XL", stock: 2 }] },
    { name: "Three-Piece Suit Men", slug: "three-piece-suit-men", brandSlug: "hugo-boss", categorySlug: "men-clothing-suits", gender: "men", originalPrice: "799.00", discountPrice: "399.00", discount: 50, material: "100% Wool", colors: ["Navy", "Charcoal"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "S", stock: 2 }, { size: "M", stock: 3 }, { size: "L", stock: 2 }, { size: "XL", stock: 1 }] },
    { name: "Linen Summer Suit Men", slug: "linen-summer-suit-men", brandSlug: "scotch-and-soda", categorySlug: "men-clothing-suits", gender: "men", originalPrice: "449.00", discountPrice: "179.00", discount: 60, material: "100% Linen", colors: ["Beige", "White", "Blue"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "S", stock: 2 }, { size: "M", stock: 3 }, { size: "L", stock: 3 }, { size: "XL", stock: 2 }] },

    // Sweaters and Cardigans
    { name: "Merino Wool V-Neck Sweater Men", slug: "merino-wool-v-neck-sweater-men", brandSlug: "tommy-hilfiger", categorySlug: "men-clothing-sweaters-and-cardigans", gender: "men", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Merino Wool", colors: ["Navy", "Grey", "Beige"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Cable Knit Crewneck Men", slug: "cable-knit-crewneck-men", brandSlug: "scotch-and-soda", categorySlug: "men-clothing-sweaters-and-cardigans", gender: "men", originalPrice: "169.00", discountPrice: "67.00", discount: 60, material: "Cotton Blend", colors: ["Beige", "Grey", "Brown"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }, { size: "XL", stock: 3 }] },
    { name: "Zip Cardigan Men", slug: "zip-cardigan-men", brandSlug: "lacoste", categorySlug: "men-clothing-sweaters-and-cardigans", gender: "men", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "Cotton Pique", colors: ["Navy", "Black", "Green"], patterns: ["Solid"], styles: ["Casual", "Business"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }, { size: "XL", stock: 3 }] },

    // Swimwear
    { name: "Swim Shorts Board Men", slug: "swim-shorts-board-men", brandSlug: "tommy-hilfiger", categorySlug: "men-clothing-swimwear", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Polyester", colors: ["Blue", "Black", "Multicolour"], patterns: ["Solid", "Striped"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Swim Trunks Classic Men", slug: "swim-trunks-classic-men", brandSlug: "lacoste", categorySlug: "men-clothing-swimwear", gender: "men", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Polyamide", colors: ["Navy", "Green", "White"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Rashguard Long Sleeve Men", slug: "rashguard-long-sleeve-men", brandSlug: "puma", categorySlug: "men-clothing-swimwear", gender: "men", originalPrice: "69.00", discountPrice: "27.00", discount: 61, material: "Polyester Spandex", colors: ["Black", "Blue", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }, { size: "XL", stock: 3 }] },

    // T-Shirts
    { name: "Classic Cotton T-Shirt Men", slug: "classic-cotton-t-shirt-men", brandSlug: "tommy-hilfiger", categorySlug: "men-clothing-t-shirts", gender: "men", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "100% Cotton", colors: ["White", "Black", "Grey", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 10 }, { size: "L", stock: 8 }, { size: "XL", stock: 5 }] },
    { name: "Polo Shirt Men Slim", slug: "polo-shirt-men-slim", brandSlug: "lacoste", categorySlug: "men-clothing-t-shirts", gender: "men", originalPrice: "99.00", discountPrice: "49.00", discount: 50, material: "Cotton Pique", colors: ["White", "Navy", "Green", "Red"], patterns: ["Solid"], styles: ["Casual", "Business"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Graphic Print T-Shirt Men", slug: "graphic-print-t-shirt-men", brandSlug: "adidas", categorySlug: "men-clothing-t-shirts", gender: "men", originalPrice: "49.00", discountPrice: "19.00", discount: 61, material: "Cotton Jersey", colors: ["Black", "White", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 6 }, { size: "M", stock: 8 }, { size: "L", stock: 7 }, { size: "XL", stock: 4 }] },

    // Trousers
    { name: "Chino Pants Slim Men", slug: "chino-pants-slim-men", brandSlug: "tommy-hilfiger", categorySlug: "men-clothing-trousers", gender: "men", originalPrice: "119.00", discountPrice: "47.00", discount: 61, material: "Cotton Chino", colors: ["Beige", "Navy", "Grey"], patterns: ["Solid"], styles: ["Casual", "Business"], sizes: [{ size: "28", stock: 4 }, { size: "30", stock: 5 }, { size: "32", stock: 5 }, { size: "34", stock: 4 }, { size: "36", stock: 2 }] },
    { name: "Tailored Trousers Men", slug: "tailored-trousers-men", brandSlug: "hugo-boss", categorySlug: "men-clothing-trousers", gender: "men", originalPrice: "199.00", discountPrice: "79.00", discount: 60, material: "Wool Blend", colors: ["Black", "Grey", "Navy"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "28", stock: 3 }, { size: "30", stock: 4 }, { size: "32", stock: 5 }, { size: "34", stock: 4 }, { size: "36", stock: 2 }] },
    { name: "Cargo Trousers Men", slug: "cargo-trousers-men", brandSlug: "g-star-raw", categorySlug: "men-clothing-trousers", gender: "men", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Cotton", colors: ["Black", "Beige", "Green"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "28", stock: 4 }, { size: "30", stock: 5 }, { size: "32", stock: 5 }, { size: "34", stock: 4 }, { size: "36", stock: 2 }] },

    // Underwear & Socks
    { name: "Boxer Brief 3 Pack Men", slug: "boxer-brief-3-pack-men", brandSlug: "calvin-klein", categorySlug: "men-clothing-underwear-and-socks", gender: "men", originalPrice: "59.00", discountPrice: "29.00", discount: 51, material: "Cotton Stretch", colors: ["Black", "White", "Grey"], patterns: ["Solid"], styles: ["Minimalism"], sizes: [{ size: "S", stock: 8 }, { size: "M", stock: 10 }, { size: "L", stock: 8 }, { size: "XL", stock: 5 }] },
    { name: "Athletic Socks 5 Pack Men", slug: "athletic-socks-5-pack-men", brandSlug: "adidas", categorySlug: "men-clothing-underwear-and-socks", gender: "men", originalPrice: "29.00", discountPrice: "14.00", discount: 52, material: "Cotton Blend", colors: ["White", "Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "39-42", stock: 10 }, { size: "43-46", stock: 8 }] },
    { name: "Long Thermal Underwear Set Men", slug: "long-thermal-underwear-set-men", brandSlug: "the-north-face", categorySlug: "men-clothing-underwear-and-socks", gender: "men", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Merino Wool", colors: ["Black", "Grey", "Beige"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }, { size: "XL", stock: 3 }] },

    // ========================================================
    // MEN — SPORTSWEAR
    // ========================================================

    // Skiwear
    { name: "Ski Jacket Insulated Men", slug: "ski-jacket-insulated-men", brandSlug: "the-north-face", categorySlug: "men-sportswear-skiwear", gender: "men", originalPrice: "549.00", discountPrice: "219.00", discount: 60, material: "Waterproof Nylon", colors: ["Black", "Blue", "Red"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 3 }, { size: "M", stock: 4 }, { size: "L", stock: 4 }, { size: "XL", stock: 2 }] },
    { name: "Ski Pants Waterproof Men", slug: "ski-pants-waterproof-men", brandSlug: "the-north-face", categorySlug: "men-sportswear-skiwear", gender: "men", originalPrice: "299.00", discountPrice: "119.00", discount: 60, material: "Waterproof Polyester", colors: ["Black", "Blue", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 3 }, { size: "M", stock: 4 }, { size: "L", stock: 3 }, { size: "XL", stock: 2 }] },
    { name: "Fleece Mid Layer Ski Men", slug: "fleece-mid-layer-ski-men", brandSlug: "the-north-face", categorySlug: "men-sportswear-skiwear", gender: "men", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Polartec Fleece", colors: ["Black", "Grey", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }, { size: "XL", stock: 3 }] },

    // Sports Accessories
    { name: "Sports Gym Bag Men", slug: "sports-gym-bag-men", brandSlug: "adidas", categorySlug: "men-sportswear-sports-accessories", gender: "men", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "Polyester", colors: ["Black", "Blue", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 12 }] },
    { name: "Resistance Bands Set Men", slug: "resistance-bands-set-men", brandSlug: "puma", categorySlug: "men-sportswear-sports-accessories", gender: "men", originalPrice: "39.00", discountPrice: "15.00", discount: 62, material: "Latex", colors: ["Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 15 }] },
    { name: "Sport Snapback Cap Men", slug: "sport-snapback-cap-men", brandSlug: "new-balance", categorySlug: "men-sportswear-sports-accessories", gender: "men", originalPrice: "35.00", discountPrice: "17.00", discount: 51, material: "Polyester", colors: ["Black", "Grey", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 15 }] },

    // Sports Clothing & Apparel
    { name: "Training Shorts Men", slug: "training-shorts-men", brandSlug: "nike", categorySlug: "men-sportswear-sports-clothing-and-apparel", gender: "men", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "Dri-FIT Polyester", colors: ["Black", "Grey", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 6 }, { size: "M", stock: 8 }, { size: "L", stock: 7 }, { size: "XL", stock: 4 }] },
    { name: "Compression Tights Men", slug: "compression-tights-men", brandSlug: "adidas", categorySlug: "men-sportswear-sports-clothing-and-apparel", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Nylon Blend", colors: ["Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 7 }, { size: "L", stock: 6 }, { size: "XL", stock: 3 }] },
    { name: "Zip-Up Track Jacket Men", slug: "zip-up-track-jacket-men", brandSlug: "puma", categorySlug: "men-sportswear-sports-clothing-and-apparel", gender: "men", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Polyester Tricot", colors: ["Black", "Blue", "Red"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },

    // Sports Shoes
    { name: "Running Shoes React Men", slug: "running-shoes-react-men", brandSlug: "nike", categorySlug: "men-sportswear-sports-shoes", gender: "men", originalPrice: "169.00", discountPrice: "84.00", discount: 50, material: "Mesh Upper", colors: ["Black", "White", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 5 }, { size: "43", stock: 4 }, { size: "44", stock: 3 }, { size: "45", stock: 2 }] },
    { name: "Ultraboost Running Men", slug: "ultraboost-running-men", brandSlug: "adidas", categorySlug: "men-sportswear-sports-shoes", gender: "men", originalPrice: "189.00", discountPrice: "94.00", discount: 50, material: "Primeknit", colors: ["Black", "White", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 5 }, { size: "43", stock: 4 }, { size: "44", stock: 3 }, { size: "45", stock: 2 }] },
    { name: "Training CrossFit Shoe Men", slug: "training-crossfit-shoe-men", brandSlug: "new-balance", categorySlug: "men-sportswear-sports-shoes", gender: "men", originalPrice: "129.00", discountPrice: "51.00", discount: 60, material: "Synthetic Mesh", colors: ["Black", "Grey", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 4 }, { size: "41", stock: 5 }, { size: "42", stock: 5 }, { size: "43", stock: 4 }, { size: "44", stock: 3 }, { size: "45", stock: 2 }] },

    // ========================================================
    // MEN — SHOES
    // ========================================================

    // Boots
    { name: "Chelsea Boots Leather Men", slug: "chelsea-boots-leather-men", brandSlug: "hugo-boss", categorySlug: "men-shoes-boots", gender: "men", originalPrice: "299.00", discountPrice: "119.00", discount: 60, material: "Full Grain Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 4 }, { size: "43", stock: 3 }, { size: "44", stock: 2 }, { size: "45", stock: 1 }] },
    { name: "Desert Boot Suede Men", slug: "desert-boot-suede-men", brandSlug: "scotch-and-soda", categorySlug: "men-shoes-boots", gender: "men", originalPrice: "199.00", discountPrice: "79.00", discount: 60, material: "Suede", colors: ["Brown", "Beige", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 4 }, { size: "43", stock: 3 }, { size: "44", stock: 2 }] },
    { name: "Work Boot Heavy Duty Men", slug: "work-boot-heavy-duty-men", brandSlug: "vans", categorySlug: "men-shoes-boots", gender: "men", originalPrice: "249.00", discountPrice: "99.00", discount: 60, material: "Leather Upper", colors: ["Brown", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 5 }, { size: "43", stock: 4 }, { size: "44", stock: 3 }, { size: "45", stock: 2 }] },

    // Lace-Up Shoes
    { name: "Oxford Derby Shoes Men", slug: "oxford-derby-shoes-men", brandSlug: "hugo-boss", categorySlug: "men-shoes-lace-up-shoes", gender: "men", originalPrice: "279.00", discountPrice: "111.00", discount: 60, material: "Full Grain Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 4 }, { size: "43", stock: 3 }, { size: "44", stock: 2 }, { size: "45", stock: 1 }] },
    { name: "Wingtip Oxford Brogue Men", slug: "wingtip-oxford-brogue-men", brandSlug: "scotch-and-soda", categorySlug: "men-shoes-lace-up-shoes", gender: "men", originalPrice: "229.00", discountPrice: "91.00", discount: 60, material: "Leather", colors: ["Brown", "Black"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 4 }, { size: "43", stock: 3 }, { size: "44", stock: 2 }] },
    { name: "Casual Lace Up Sneaker Men", slug: "casual-lace-up-sneaker-men", brandSlug: "new-balance", categorySlug: "men-shoes-lace-up-shoes", gender: "men", originalPrice: "149.00", discountPrice: "59.00", discount: 60, material: "Leather and Mesh", colors: ["White", "Grey", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 4 }, { size: "41", stock: 5 }, { size: "42", stock: 5 }, { size: "43", stock: 4 }, { size: "44", stock: 3 }, { size: "45", stock: 2 }] },

    // Loafers
    { name: "Penny Loafer Leather Men", slug: "penny-loafer-leather-men", brandSlug: "hugo-boss", categorySlug: "men-shoes-loafers", gender: "men", originalPrice: "249.00", discountPrice: "99.00", discount: 60, material: "Full Grain Leather", colors: ["Brown", "Black", "Beige"], patterns: ["Solid"], styles: ["Business", "Casual", "Elegant"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 4 }, { size: "43", stock: 3 }, { size: "44", stock: 2 }, { size: "45", stock: 1 }] },
    { name: "Suede Tassel Loafer Men", slug: "suede-tassel-loafer-men", brandSlug: "scotch-and-soda", categorySlug: "men-shoes-loafers", gender: "men", originalPrice: "199.00", discountPrice: "79.00", discount: 60, material: "Suede", colors: ["Brown", "Beige", "Navy"], patterns: ["Solid"], styles: ["Casual", "Business"], sizes: [{ size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 4 }, { size: "43", stock: 3 }, { size: "44", stock: 2 }] },
    { name: "Driving Moccasin Loafer Men", slug: "driving-moccasin-loafer-men", brandSlug: "lacoste", categorySlug: "men-shoes-loafers", gender: "men", originalPrice: "179.00", discountPrice: "71.00", discount: 60, material: "Leather", colors: ["Brown", "Black", "Beige"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 4 }, { size: "41", stock: 4 }, { size: "42", stock: 5 }, { size: "43", stock: 4 }, { size: "44", stock: 3 }, { size: "45", stock: 2 }] },

    // Sandals & Flip Flops
    { name: "Leather Sandal Men", slug: "leather-sandal-men", brandSlug: "lacoste", categorySlug: "men-shoes-sandals-and-flip-flops", gender: "men", originalPrice: "119.00", discountPrice: "47.00", discount: 61, material: "Leather", colors: ["Brown", "Black", "Beige"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 4 }, { size: "41", stock: 5 }, { size: "42", stock: 5 }, { size: "43", stock: 4 }, { size: "44", stock: 3 }, { size: "45", stock: 2 }] },
    { name: "Flip Flops Adilette Men", slug: "flip-flops-adilette-men", brandSlug: "adidas", categorySlug: "men-shoes-sandals-and-flip-flops", gender: "men", originalPrice: "45.00", discountPrice: "22.00", discount: 51, material: "Synthetic Slides", colors: ["Black", "White", "Blue"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 8 }, { size: "41", stock: 8 }, { size: "42", stock: 7 }, { size: "43", stock: 6 }, { size: "44", stock: 5 }, { size: "45", stock: 3 }] },
    { name: "Sport Sandal Velcro Men", slug: "sport-sandal-velcro-men", brandSlug: "puma", categorySlug: "men-shoes-sandals-and-flip-flops", gender: "men", originalPrice: "69.00", discountPrice: "27.00", discount: 61, material: "Synthetic", colors: ["Black", "Grey", "Brown"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 5 }, { size: "41", stock: 5 }, { size: "42", stock: 6 }, { size: "43", stock: 5 }, { size: "44", stock: 4 }, { size: "45", stock: 2 }] },

    // Trainers
    { name: "Air Force Classic Men", slug: "air-force-classic-men", brandSlug: "nike", categorySlug: "men-shoes-trainers", gender: "men", originalPrice: "149.00", discountPrice: "74.00", discount: 50, material: "Leather Upper", colors: ["White", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 4 }, { size: "41", stock: 5 }, { size: "42", stock: 6 }, { size: "43", stock: 5 }, { size: "44", stock: 4 }, { size: "45", stock: 2 }] },
    { name: "Stan Smith Leather Men", slug: "stan-smith-leather-men", brandSlug: "adidas", categorySlug: "men-shoes-trainers", gender: "men", originalPrice: "129.00", discountPrice: "64.00", discount: 50, material: "Leather", colors: ["White", "Black"], patterns: ["Solid"], styles: ["Casual", "Minimalism"], sizes: [{ size: "40", stock: 5 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 5 }, { size: "44", stock: 4 }, { size: "45", stock: 2 }] },
    { name: "Old Skool Trainers Men", slug: "old-skool-trainers-men", brandSlug: "vans", categorySlug: "men-shoes-trainers", gender: "men", originalPrice: "99.00", discountPrice: "49.00", discount: 50, material: "Canvas and Suede", colors: ["Black", "White", "Navy"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "40", stock: 5 }, { size: "41", stock: 6 }, { size: "42", stock: 6 }, { size: "43", stock: 5 }, { size: "44", stock: 4 }, { size: "45", stock: 3 }] },

    // ========================================================
    // MEN — ACCESSORIES
    // ========================================================

    // Bags
    { name: "Leather Briefcase Men", slug: "leather-briefcase-men", brandSlug: "hugo-boss", categorySlug: "men-accessories-bags", gender: "men", originalPrice: "399.00", discountPrice: "159.00", discount: 60, material: "Full Grain Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Elegant"], sizes: [{ size: "One Size", stock: 6 }] },
    { name: "Canvas Backpack Men", slug: "canvas-backpack-men", brandSlug: "adidas", categorySlug: "men-accessories-bags", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Canvas", colors: ["Black", "Grey", "Navy"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Messenger Bag Leather Men", slug: "messenger-bag-leather-men", brandSlug: "scotch-and-soda", categorySlug: "men-accessories-bags", gender: "men", originalPrice: "249.00", discountPrice: "99.00", discount: 60, material: "Leather", colors: ["Brown", "Black"], patterns: ["Solid"], styles: ["Casual", "Business"], sizes: [{ size: "One Size", stock: 8 }] },

    // Belts
    { name: "Leather Belt Classic Men", slug: "leather-belt-classic-men", brandSlug: "hugo-boss", categorySlug: "men-accessories-belts", gender: "men", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Full Grain Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Canvas Belt Woven Men", slug: "canvas-belt-woven-men", brandSlug: "tommy-hilfiger", categorySlug: "men-accessories-belts", gender: "men", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "Canvas", colors: ["Navy", "Black", "Beige"], patterns: ["Plaid", "Solid"], styles: ["Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },
    { name: "Reversible Leather Belt Men", slug: "reversible-leather-belt-men", brandSlug: "calvin-klein", categorySlug: "men-accessories-belts", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Genuine Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "S", stock: 5 }, { size: "M", stock: 6 }, { size: "L", stock: 5 }, { size: "XL", stock: 3 }] },

    // Hats & Caps
    { name: "Wool Beanie Men", slug: "wool-beanie-men", brandSlug: "the-north-face", categorySlug: "men-accessories-hats-and-caps", gender: "men", originalPrice: "49.00", discountPrice: "24.00", discount: 51, material: "Wool Acrylic", colors: ["Black", "Grey", "Navy"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 12 }] },
    { name: "Snapback Cap Men", slug: "snapback-cap-men", brandSlug: "new-balance", categorySlug: "men-accessories-hats-and-caps", gender: "men", originalPrice: "39.00", discountPrice: "15.00", discount: 62, material: "Cotton Twill", colors: ["Black", "White", "Navy"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 12 }] },
    { name: "Fedora Felt Hat Men", slug: "fedora-felt-hat-men", brandSlug: "scotch-and-soda", categorySlug: "men-accessories-hats-and-caps", gender: "men", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Wool Felt", colors: ["Brown", "Black", "Beige"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "One Size", stock: 8 }] },

    // Jewellery
    { name: "Stainless Steel Chain Necklace Men", slug: "stainless-steel-chain-necklace-men", brandSlug: "guess", categorySlug: "men-accessories-jewellery", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Stainless Steel", colors: ["Silver", "Gold"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Leather Bracelet Men", slug: "leather-bracelet-men", brandSlug: "scotch-and-soda", categorySlug: "men-accessories-jewellery", gender: "men", originalPrice: "59.00", discountPrice: "23.00", discount: 61, material: "Leather and Metal", colors: ["Brown", "Black"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 12 }] },
    { name: "Signet Ring Men", slug: "signet-ring-men", brandSlug: "guess", categorySlug: "men-accessories-jewellery", gender: "men", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Sterling Silver", colors: ["Silver", "Gold"], patterns: ["Solid"], styles: ["Elegant"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }] },

    // Scarves & Gloves
    { name: "Wool Scarf Men Classic", slug: "wool-scarf-men-classic", brandSlug: "tommy-hilfiger", categorySlug: "men-accessories-scarves-and-gloves", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Wool Blend", colors: ["Grey", "Navy", "Black"], patterns: ["Striped", "Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Leather Gloves Men", slug: "leather-gloves-men", brandSlug: "hugo-boss", categorySlug: "men-accessories-scarves-and-gloves", gender: "men", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Genuine Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Elegant", "Business"], sizes: [{ size: "S", stock: 4 }, { size: "M", stock: 5 }, { size: "L", stock: 4 }] },
    { name: "Cashmere Scarf Men", slug: "cashmere-scarf-men", brandSlug: "hugo-boss", categorySlug: "men-accessories-scarves-and-gloves", gender: "men", originalPrice: "199.00", discountPrice: "79.00", discount: 60, material: "100% Cashmere", colors: ["Beige", "Grey", "Navy"], patterns: ["Solid"], styles: ["Elegant", "Business"], sizes: [{ size: "One Size", stock: 8 }] },

    // Sunglasses
    { name: "Wayfarer Sunglasses Men", slug: "wayfarer-sunglasses-men", brandSlug: "lacoste", categorySlug: "men-accessories-sunglasses", gender: "men", originalPrice: "159.00", discountPrice: "63.00", discount: 60, material: "Acetate", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Aviator Sunglasses Men", slug: "aviator-sunglasses-men", brandSlug: "guess", categorySlug: "men-accessories-sunglasses", gender: "men", originalPrice: "139.00", discountPrice: "55.00", discount: 60, material: "Metal Frame", colors: ["Gold", "Silver"], patterns: ["Solid"], styles: ["Casual", "Elegant"], sizes: [{ size: "One Size", stock: 8 }] },
    { name: "Square Sports Sunglasses Men", slug: "square-sports-sunglasses-men", brandSlug: "adidas", categorySlug: "men-accessories-sunglasses", gender: "men", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "Polycarbonate", colors: ["Black", "Grey"], patterns: ["Solid"], styles: ["Casual"], sizes: [{ size: "One Size", stock: 10 }] },

    // Ties
    { name: "Silk Tie Classic Men", slug: "silk-tie-classic-men", brandSlug: "hugo-boss", categorySlug: "men-accessories-ties", gender: "men", originalPrice: "99.00", discountPrice: "39.00", discount: 61, material: "100% Silk", colors: ["Navy", "Black", "Burgundy"], patterns: ["Solid", "Striped"], styles: ["Business", "Elegant"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Wool Knit Tie Men", slug: "wool-knit-tie-men", brandSlug: "scotch-and-soda", categorySlug: "men-accessories-ties", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Wool", colors: ["Navy", "Grey", "Brown"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Patterned Silk Tie Men", slug: "patterned-silk-tie-men", brandSlug: "tommy-hilfiger", categorySlug: "men-accessories-ties", gender: "men", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "100% Silk", colors: ["Blue", "Red", "Multicolour"], patterns: ["Geometric", "Striped"], styles: ["Business", "Elegant"], sizes: [{ size: "One Size", stock: 10 }] },

    // Wallets & Cardholders
    { name: "Bifold Leather Wallet Men", slug: "bifold-leather-wallet-men", brandSlug: "hugo-boss", categorySlug: "men-accessories-wallets-and-cardholders", gender: "men", originalPrice: "119.00", discountPrice: "47.00", discount: 61, material: "Full Grain Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Casual"], sizes: [{ size: "One Size", stock: 10 }] },
    { name: "Slim Card Holder Men", slug: "slim-card-holder-men", brandSlug: "calvin-klein", categorySlug: "men-accessories-wallets-and-cardholders", gender: "men", originalPrice: "79.00", discountPrice: "31.00", discount: 61, material: "Leather", colors: ["Black", "Brown"], patterns: ["Solid"], styles: ["Business", "Minimalism"], sizes: [{ size: "One Size", stock: 12 }] },
    { name: "Trifold Wallet Men", slug: "trifold-wallet-men", brandSlug: "tommy-hilfiger", categorySlug: "men-accessories-wallets-and-cardholders", gender: "men", originalPrice: "89.00", discountPrice: "35.00", discount: 61, material: "Genuine Leather", colors: ["Brown", "Black", "Navy"], patterns: ["Solid"], styles: ["Casual", "Business"], sizes: [{ size: "One Size", stock: 10 }] },
]

function toSlug(name: string): string {
    return name.toLowerCase().replace(/[&]/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

async function seedColours() {
    console.log("Seeding colours...")
    await db.insert(color).values(colours).onConflictDoNothing()
    console.log(`✓ ${colours.length} colours seeded`)
}

async function seedPatterns() {
    console.log("Seeding patterns...")
    await db.insert(pattern).values(patterns.map(name => ({ name }))).onConflictDoNothing()
    console.log(`✓ ${patterns.length} patterns seeded`)
}

async function seedStyles() {
    console.log("Seeding styles...")
    await db.insert(style).values(styles.map(name => ({ name }))).onConflictDoNothing()
    console.log(`✓ ${styles.length} styles seeded`)
}

async function seedProducts() {
    console.log("Seeding products...")

    // Загружаем все бренды и категории из БД
    const brands = await db.select().from(brand)
    const categories = await db.select().from(category)
    const colors = await db.select().from(color)
    const patterns = await db.select().from(pattern)
    const styles = await db.select().from(style)

    const brandMap = new Map(brands.map(b => [b.slug, b.id]))
    const categoryMap = new Map(categories.map(c => [c.slug, c.id]))
    const colorMap = new Map(colors.map(c => [c.name, c.id]))
    const patternMap = new Map(patterns.map(p => [p.name, p.id]))
    const styleMap = new Map(styles.map(s => [s.name, s.id]))

    let productCount = 0
    let skipped = 0

    for (const p of productsData) {
        const brandId = brandMap.get(p.brandSlug)
        const categoryId = categoryMap.get(p.categorySlug)

        if (!brandId) { console.warn(`  ⚠ Brand not found: ${p.brandSlug}`); skipped++; continue }
        if (!categoryId) { console.warn(`  ⚠ Category not found: ${p.categorySlug}`); skipped++; continue }

        // Создаём продукт
        const [created] = await db.insert(product).values({
            name: p.name,
            slug: p.slug,
            shortDescription: `${p.name} — premium quality ${p.gender}'s fashion.`,
            originalPrice: p.originalPrice,
            discountPrice: p.discountPrice,
            discount: p.discount,
            material: p.material,
            gender: p.gender,
            brandId,
            categoryId,
            isActive: true,
        }).onConflictDoNothing().returning()

        if (!created) { skipped++; continue }

        // Размеры
        for (const s of p.sizes) {
            await db.insert(productSize).values({
                productId: created.id,
                size: s.size,
                stockAmount: s.stock,
            }).onConflictDoNothing()
        }

        // Цвета
        for (const colorName of p.colors) {
            const colorId = colorMap.get(colorName)
            if (colorId) {
                await db.insert(productColor).values({ productId: created.id, colorId }).onConflictDoNothing()
            }
        }

        // Паттерны
        for (const patternName of p.patterns) {
            const patternId = patternMap.get(patternName)
            if (patternId) {
                await db.insert(productPattern).values({ productId: created.id, patternId }).onConflictDoNothing()
            }
        }

        // Стили
        for (const styleName of p.styles) {
            const styleId = styleMap.get(styleName)
            if (styleId) {
                await db.insert(productStyle).values({ productId: created.id, styleId }).onConflictDoNothing()
            }
        }

        productCount++
    }

    console.log(`✓ ${productCount} products seeded (${skipped} skipped)`)
}

async function main() {
    try {
        await seedColours()
        await seedPatterns()
        await seedStyles()
        await seedProducts()
        console.log("\n✅ Products seed completed successfully")
    } catch (error) {
        console.error("❌ Seed failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()