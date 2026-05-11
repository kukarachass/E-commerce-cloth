import {Sort} from "@/store/useFiltersStore";

export const womenBrands = [
    "Adidas", "s.Oliver", "Summum Woman", "Chantelle"
]
export const menBrands = [
    "AllSaints", "Levi's", "s.Oliver", "Lyle & Scott"
]

export const patterns = [
    "Animal", "Camouflage", "Floral", "Geometric", "Paisley", "Polka Dot", "Striped", "Plaid", "Solid"
]

export const colours  = [
    { name: "Beige", hex: "#F5F0E8" },
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#4A7FD4" },
    { name: "Brown", hex: "#8B5E3C" },
    { name: "Gold", hex: "#D4A843" },
    { name: "Green", hex: "#4CAF82" },
    { name: "Grey", hex: "#B0B0B0" },
    { name: "Multicolour", hex: "linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)" },
    { name: "Orange", hex: "#FF9500" },
    { name: "Pink", hex: "#FFB3BA" },
    { name: "Purple", hex: "#9B6DD4" },
    { name: "Red", hex: "#E84343" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Yellow", hex: "#FFD43B" },
]

export const styles = {
    shoeStyles: ["Business", "Casual", "Elegant", "Minimalism"],
    accessoriesStyles: ["Business", "Casual", "Elegant", "Minimalism"],
    sportswearStyles: ["Casual", "Elegant", "Minimalism"],
    clothStyles: ["Business", "Casual", "Elegant", "Minimalism", "Evening"],
}

export const sizes = {
    accessories: {
        tabs: ["INT", "UK", "EU", "IT", "Size (cm)"] as const,
        INT: ["OS", "XS", "S", "M", "L", "XL", "L/XL", "M/L", "OS Large", "OS Men", "OS Women", "OS Youth", "S-M", "S/M", "XS/S"],
        UK: ["8", "10", "12", "14", "16"],
        EU: ["34"],
        IT: ["38", "40", "42", "44", "46", "48"],
        "Size (cm)": ["60", "65", "70", "75", "80", "85", "90", "95", "100", "105", "110", "115"],
    },
    shoes: {
        tabs: ["INT", "UK", "EU", "US", "FR", "IT", "DE"] as const,
        INT: ["S", "M", "L"],
        UK: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "2.5", "3.5", "4.5", "5.5", "6.5", "7.5", "8 1/2", "8.5", "9.5", "10.5", "11.5"],
        EU: ["10", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "34.5", "35 1/2", "35.5", "36 2/3", "36.5", "36.5 X-Wide", "37 1/3", "37 W", "37 X-Wide", "37.5", "38 2/3", "38.5", "39 1/3", "39.5", "40 1/2", "40 2/3", "40.5", "41 1/3", "41.5", "42 2/3", "42.5", "43 1/3", "44 1/2", "44 2/3", "44.5", "45 1/3", "45.5", "46 2/3", "46.5", "47 1/3", "47.5", "48 1/2", "48 2/3", "48.5", "49 1/3", "50 2/3", "51 1/3"],
        US: ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "4.5", "5.5", "6.5", "7.5", "8.5", "9.5", "10 1/2", "10.5", "11.5", "12.5", "13.5"],
        FR: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "36.5", "37.5", "38.5", "39.5", "40.5", "41.5", "42.5"],
        IT: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "35.5", "36.5", "37.5", "38.5", "39.5", "40.5", "41.5"],
        DE: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "35.5", "36.5", "37.5", "38.5", "39.5", "40.5", "41.5"],
    },
    sportswear: {
        tabs: ["INT", "UK", "EU", "US", "FR", "IT", "DE"] as const,
        INT: ["OS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "2X (A-B)", "2XL Tall", "2XS (C-D)", "2XS 8 CM", "2XS 10 CM", "2XS 13 CM", "3XL Tall", "L (A-B)", "L (A-C)", "L (C-D)", "L 8 CM", "L 13 CM", "L Short", "L/XL", "M (A-B)", "M (A-C)", "M (C-D)", "M (E-G)", "M 8 CM", "M 13 CM", "M D-DD", "M Tall", "M/L", "OS Large", "OS Men", "OS Women", "OS Youth", "S (A-B)", "S (A-C)", "S (C-D)", "S (D-DD)", "S 8 CM", "S Short", "S/M", "XL (A-B)", "XL (C-D)", "XL 13 CM", "XL Tall", "XS (A-B)", "XS (C-D)", "XS (E-G)", "XS 8 CM", "XS 10 CM", "XS 13 CM", "XS D-DD", "XS/S", "XXS/XS"],
        UK: ["3", "4", "5", "6", "7", "8", "9", "10", "12", "14", "16", "2.5", "3.5", "4.5", "5.5", "6.5", "7.5", "8.5", "10-12"],
        EU: ["32", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "50", "52", "54", "35 1/2", "35.5", "36 2/3", "36.5", "36.5 X-Wide", "37 1/3", "37 X-Wide", "37.5", "38 2/3", "38.5", "39 1/3", "39.5", "40 1/2", "40 2/3", "40.5", "41 1/3", "41.5", "42 2/3", "42.5", "43 1/3", "44 1/2", "44 2/3", "44.5", "45 1/3", "45.5", "46 2/3", "46.5", "47 1/3", "47.5", "48 1/2", "48 2/3", "49 1/3", "50 2/3"],
        US: ["2", "4", "4-6", "5", "6", "6-8", "7", "8", "9", "10", "11", "12", "0-2", "5.5", "6.5", "7.5", "8.5", "9.5", "10.5"],
        FR: ["34", "36", "38", "40", "42", "44", "85", "90", "95", "100", "105"],
        IT: ["38", "40", "42", "44", "46", "48"],
        DE: ["34", "40", "42", "44", "46"],
    },
    clothes: {
        tabs: ["INT", "UK", "EU", "US", "FR", "IT", "DE", "Waist", "Waist/Length", "Other", "Years"] as const,
        INT: ["OS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "2X (A-B)", "2XL long", "2XL Tall", "2XS (C-D)", "L (A-B)", "L (C-D)", "L long", "L Short", "M (A-B)", "M (C-D)", "M long", "M Tall", "S (A-B)", "S (C-D)", "S long", "S Short", "XL (A-B)", "XL long", "XL Tall", "XS (A-B)", "XS (C-D)", "XS long", "XXS long", "XXS/XS"],
        UK: ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24", "6 LONG", "6 PETITE", "6 REGULAR", "6 SHORT", "8 LONG", "8 PETITE", "8 REGULAR", "8 SHORT", "10 LONG", "10 PETITE", "10 REGULAR", "10 SHORT", "12 LONG", "12 REGULAR", "12 SHORT", "14 LONG", "14 PETITE", "14 REGULAR", "14 SHORT", "16 LONG", "16 PETITE", "16 REGULAR", "16 SHORT", "18 LONG", "18 PETITE", "18 REGULAR", "18 SHORT", "20 LONG", "20 PETITE", "20 REGULAR", "20 SHORT"],
        EU: ["26", "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "34-36", "36-38", "38-40", "40-42", "42-44", "44-46", "34R", "36R", "38R", "40R", "42R", "44R", "34S", "36S", "38S", "40S", "42S"],
        US: ["0", "00", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "24", "26", "28", "29", "30", "32", "34", "2-4", "4-6", "6-8"],
        FR: ["24", "25", "26", "27", "28", "29", "30", "32", "33", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "34-36", "36-38", "38-40", "40-42"],
        IT: ["32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "38-40", "40-42", "42-44", "44-46"],
        DE: ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "52", "54", "32-34", "34-36", "36-38", "38-40"],
        Waist: ["23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "36", "38", "40", "42", "44", "46", "W24", "W25", "W26", "W27", "W28", "W29", "W30", "W31", "W32", "W33", "W34", "W36", "W38", "W40", "W42", "W44", "W46", "W48"],
        "Waist/Length": ["W23L28", "W23L30", "W24L28", "W24L30", "W24L32", "W25L28", "W25L30", "W25L32", "W26L28", "W26L30", "W26L32", "W27L28", "W27L30", "W27L32", "W28L28", "W28L30", "W28L32", "W29L28", "W29L30", "W29L32", "W30L28", "W30L30", "W30L32", "W31L30", "W31L32", "W32L28", "W32L30", "W32L32", "W33L30", "W33L32", "W34L28", "W34L30", "W34L32", "W36L30", "W36L32", "W38L30", "W38L32", "W40L30", "W40L32"],
        Other: ["XS", "S", "M", "L", "XL", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "36"],
        Years: ["1", "4", "8"],
    },
} as const

export const discounts = [60, 70, 80];

export const categoryItems = {
    men: {
        clothing: [
            { name: "T-Shirts", subcategories: [] },
            { name: "Shirts", subcategories: [] },
            { name: "Trousers", subcategories: [] },
            { name: "Sweaters and Cardigans", subcategories: [] },
            { name: "Jackets", subcategories: [] },
            { name: "Jeans", subcategories: [] },
            { name: "Suits", subcategories: [] },
            { name: "Swimwear", subcategories: [] },
            { name: "Underwear & Socks", subcategories: [] },
            { name: "Coats", subcategories: [] },
            { name: "Nightwear", subcategories: [] },
        ],
        sportswear: [
            { name: "Sports Clothing & Apparel", subcategories: [] },
            { name: "Sports Shoes", subcategories: [] },
            { name: "Skiwear", subcategories: [] },
            { name: "Sports Accessories", subcategories: [] },
        ],
        shoes: [
            { name: "Trainers", subcategories: [] },
            { name: "Lace-Up Shoes", subcategories: [] },
            { name: "Boots", subcategories: [] },
            { name: "Loafers", subcategories: [] },
            { name: "Sandals & Flip Flops", subcategories: [] },
        ],
        accessories: [
            { name: "Hats & Caps", subcategories: [] },
            { name: "Sunglasses", subcategories: [] },
            { name: "Bags", subcategories: [] },
            { name: "Scarves & Gloves", subcategories: [] },
            { name: "Belts", subcategories: [] },
            { name: "Ties", subcategories: [] },
            { name: "Jewellery", subcategories: [] },
            { name: "Wallets & Cardholders", subcategories: [] },
        ],
    },
    women: {
        clothing: [
            { name: "Shirts and Tops", subcategories: [] },
            { name: "Dresses", subcategories: [] },
            { name: "Trousers", subcategories: [] },
            { name: "Sweaters and Cardigans", subcategories: [] },
            { name: "Jackets", subcategories: [] },
            { name: "Jeans", subcategories: [] },
            { name: "Skirts", subcategories: [] },
            { name: "Swimwear", subcategories: [] },
            { name: "Lingerie", subcategories: [] },
            { name: "Coats", subcategories: [] },
            { name: "Jumpsuits", subcategories: [] },
            { name: "Nightwear", subcategories: [] },
            { name: "Socks", subcategories: [] },
        ],
        sportswear: [
            { name: "Sports Clothing & Apparel", subcategories: [] },
            { name: "Sports Shoes", subcategories: [] },
            { name: "Skiwear", subcategories: [] },
            { name: "Sports Accessories", subcategories: [] },
        ],
        shoes: [
            { name: "Trainers", subcategories: [] },
            { name: "Sandals", subcategories: [] },
            { name: "Boots", subcategories: [] },
            { name: "Pumps", subcategories: [] },
            { name: "Slippers & Flip Flops", subcategories: [] },
            { name: "Mules", subcategories: [] },
            { name: "Espadrilles", subcategories: [] },
            { name: "Loafers", subcategories: [] },
            { name: "Ballerina Shoes", subcategories: [] },
            { name: "Brogues", subcategories: [] },
        ],
        accessories: [
            { name: "Bags", subcategories: [] },
            { name: "Sunglasses", subcategories: [] },
            { name: "Jewellery & Watches", subcategories: [] },
            { name: "Belts", subcategories: [] },
            { name: "Hats & Caps", subcategories: [] },
            { name: "Scarves", subcategories: [] },
            { name: "Wallets & Cardholders", subcategories: [] },
            { name: "Gloves", subcategories: [] },
            { name: "Hair Accessories", subcategories: [] },
            { name: "Tech Accessories", subcategories: [] },
        ],
    },
} as const

export const sortVariants: Sort[] = [
    "popularity",
    "new",
    "new discount",
    "price: high to low",
    "price: low to high"
]
export const categoryBrands = {
    women: {
        sportswear: ["Adidas", "Nike", "Puma", "New Balance"],
        shoes: ["Nike", "New Balance", "Birkenstock", "UGG"],
        accessories: ["Gucci", "Calvin Klein", "Coach", "Ray-Ban"],
    },
    men: {
        sportswear: ["Adidas", "Nike", "The North Face", "Puma"],
        shoes: ["Nike", "New Balance", "Adidas", "Timberland"],
        accessories: ["Hugo Boss", "Calvin Klein", "Lacoste", "Ray-Ban"],
    },
} as const

export const productsArray = [
    {
        id: "1",
        brand: "Gucci",
        imgUrl: ["/product-image.webp", "/product2.webp", "/product3.webp", "product4.webp"],
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
        imgUrl: ["/product-image.webp", "/product2.webp", "/product3.webp", "product4.webp"],
        name: "Dolce Kabana",
        description: "Ahuenno super zaebis",
        price: 120,
        sizes: ["L", "M", "S", "XS", "XXS",],

        descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
        material: "Cotton Mix",
        careInstructions: "Please Follow The Care Instructions On The Care Label"
    },
    {
        id: "4",
        brand: "Gucci",
        imgUrl: ["/product-image.webp", "/product2.webp", "/product3.webp", "product4.webp"],
        name: "Dolce Kabana",
        description: "Ahuenno super zaebis",
        price: 120,
        sizes: ["L", "M", "S", "XS", "XXS",],

        descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
        material: "Cotton Mix",
        careInstructions: "Please Follow The Care Instructions On The Care Label"
    },
    {
        id: "5",
        brand: "Gucci",
        imgUrl: ["/product-image.webp", "/product2.webp", "/product3.webp", "product4.webp"],
        name: "Dolce Kabana",
        description: "Ahuenno super zaebis",
        price: 120,
        sizes: ["L", "M", "S", "XS", "XXS",],

        descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
        material: "Cotton Mix",
        careInstructions: "Please Follow The Care Instructions On The Care Label"
    },
    {
        id: "6",
        brand: "Gucci",
        imgUrl: ["/product-image.webp", "/product2.webp", "/product3.webp", "product4.webp"],
        name: "Dolce Kabana",
        description: "Ahuenno super zaebis",
        price: 120,
        sizes: ["L", "M", "S", "XS", "XXS",],

        descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
        material: "Cotton Mix",
        careInstructions: "Please Follow The Care Instructions On The Care Label"
    },
    {
        id: "7",
        brand: "Gucci",
        imgUrl: ["/product-image.webp", "/product2.webp", "/product3.webp", "product4.webp"],
        name: "Dolce Kabana",
        description: "Ahuenno super zaebis",
        price: 120,
        sizes: ["L", "M", "S", "XS", "XXS",],

        descriptionFull: "Placing A Playful Twist On Classic Gingham, Tammy Features A Bold, Scaled Up Check On Tactile Linton Tweed And Is Finished With A Stylish Raw Edge. This A-Line Skirt With Front Patch Pockets Looks Effortless Styled With A Tucked In Tee Or Camisole And A Simple Pair Of Sandals.&Nbsp;",
        material: "Cotton Mix",
        careInstructions: "Please Follow The Care Instructions On The Care Label"
    },
]