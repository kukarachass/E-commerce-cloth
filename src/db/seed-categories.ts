import { config } from "dotenv"
config({ path: ".env" })

import { db } from "@/db/seed-client"
import { category } from "@/db/schema"
import { eq } from "drizzle-orm"

// ============================================================
// ДЕРЕВО КАТЕГОРИЙ
// children: string  → лист (нет потомков)
// children: object  → узел со своими потомками
// slug = parentSlug + "-" + toSlug(name); gender и level — автоматически
// ============================================================

type TreeNode = { name: string; children?: (string | TreeNode)[] }

// --- WOMEN CLOTHING ---
const womenClothing: TreeNode[] = [
    { name: "Coats", children: ["Parkas", "Single Breasted Coats", "Double Breasted Coats", "Trenchcoats", "Wrap Coats", "Faux Fur Coats"] },
    { name: "Dresses", children: ["Midi Dresses", "Mini Dresses", "Shirt Dresses", "Maxi Dresses", "Leather Dresses"] },
    { name: "Jackets", children: ["Blazers", "Cropped Jackets", "Waistcoats & Gilets", "Winter Jackets", "Bomber Jackets", "Denim Jackets", "Raincoats", "Overshirts", "Leather & Biker Jackets", "Faux Fur Jackets", "Military Jackets", "Ponchos & Capes"] },
    { name: "Jeans", children: ["Straight Jeans", "Skinny Jeans", "Slim Jeans", "Flared"] },
    { name: "Jumpsuits", children: ["Jumpsuits", "Playsuits"] },
    { name: "Lingerie", children: ["Underwear", "Bras", "Torsolets, Brassieres & Corsets", "Corrective Underwear", "Hosiery", "Lingerie Tops"] },
    { name: "Nightwear", children: ["Pyjamas", "Dressing Gowns & Kimonos"] },
    { name: "Shirts and Tops", children: ["Blouses", "Long-Sleeved Tops", "T-Shirts", "Shirts", "Tanks & Camis", "Poloshirts", "Bodysuits"] },
    { name: "Skirts", children: ["Midi Skirts", "Mini Skirts", "Maxi Skirts", "Denim Skirts", "Leather Skirts"] },
    { name: "Socks" },
    { name: "Sweaters and Cardigans", children: ["Sweaters", "Knitted Sweaters", "Cardigans", "Hoodies"] },
    { name: "Swimwear", children: ["Bikinis", "Swimsuits", "Tankinis", "Towels"] },
    { name: "Trousers", children: ["Wide-Leg & Flared Trousers", "Formal Trousers", "Straight Trousers", "Shorts", "Sweatpants", "Cargo Pants", "Leather Trousers", "Chinos", "Leggings", "Skinny Trousers"] },
]

// --- MEN CLOTHING (мужские категории, без платьев/белья/юбок) ---
const menClothing: TreeNode[] = [
    { name: "Coats", children: ["Parkas", "Single Breasted Coats", "Double Breasted Coats", "Trenchcoats", "Overcoats", "Puffer Coats"] },
    { name: "Jackets", children: ["Blazers", "Bomber Jackets", "Denim Jackets", "Leather & Biker Jackets", "Winter Jackets", "Overshirts", "Gilets", "Raincoats", "Field Jackets", "Track Jackets"] },
    { name: "Jeans", children: ["Straight Jeans", "Skinny Jeans", "Slim Jeans", "Tapered Jeans", "Relaxed Jeans"] },
    { name: "Trousers", children: ["Chinos", "Formal Trousers", "Cargo Pants", "Sweatpants", "Shorts", "Joggers"] },
    { name: "Shirts", children: ["Casual Shirts", "Formal Shirts", "Denim Shirts", "Flannel Shirts", "Linen Shirts"] },
    { name: "T-Shirts and Polos", children: ["Crew Neck T-Shirts", "V-Neck T-Shirts", "Polo Shirts", "Long-Sleeved Tops", "Graphic Tees"] },
    { name: "Sweaters and Cardigans", children: ["Sweaters", "Knitted Sweaters", "Cardigans", "Hoodies", "Sweatshirts"] },
    { name: "Suits", children: ["Two-Piece Suits", "Three-Piece Suits", "Tuxedos", "Waistcoats"] },
    { name: "Swimwear", children: ["Swim Shorts", "Swim Trunks", "Rashguards"] },
    { name: "Nightwear", children: ["Pyjamas", "Dressing Gowns", "Loungewear"] },
    { name: "Underwear and Socks", children: ["Boxers", "Briefs", "Trunks", "Vests", "Socks"] },
]

// --- остальные топ-категории (2 уровня) ---
const womenShoes = ["Trainers", "Sandals", "Boots", "Pumps", "Slippers & Flip Flops", "Mules", "Espadrilles", "Loafers", "Ballerina Shoes", "Brogues"]
const menShoes = ["Boots", "Lace-Up Shoes", "Loafers", "Sandals & Flip Flops", "Trainers"]
const womenAccessories = ["Bags", "Sunglasses", "Jewellery & Watches", "Belts", "Hats & Caps", "Scarves", "Wallets & Cardholders", "Gloves", "Hair Accessories", "Tech Accessories"]
const menAccessories = ["Bags", "Belts", "Hats & Caps", "Jewellery", "Scarves & Gloves", "Sunglasses", "Ties", "Wallets & Cardholders"]
const womenSportswear = ["Sports Clothing & Apparel", "Sports Shoes", "Skiwear", "Sports Accessories"]
const menSportswear = ["Skiwear", "Sports Accessories", "Sports Clothing & Apparel", "Sports Shoes"]

function buildTop(gender: "women" | "men"): TreeNode[] {
    return [
        { name: "Clothing", children: gender === "women" ? womenClothing : menClothing },
        { name: "Sportswear", children: gender === "women" ? womenSportswear : menSportswear },
        { name: "Shoes", children: gender === "women" ? womenShoes : menShoes },
        { name: "Accessories", children: gender === "women" ? womenAccessories : menAccessories },
    ]
}

function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/'/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

async function upsertCategory(values: {
    name: string; slug: string; gender: string; level: number; parentId: string | null
}): Promise<string> {
    const [inserted] = await db.insert(category).values(values).onConflictDoNothing().returning()
    if (inserted) return inserted.id
    const existing = await db.query.category.findFirst({ where: eq(category.slug, values.slug) })
    return existing!.id
}

async function insertTree(
    nodes: (string | TreeNode)[],
    gender: string,
    parentId: string | null,
    parentSlug: string,
    level: number,
) {
    for (const raw of nodes) {
        const node: TreeNode = typeof raw === "string" ? { name: raw } : raw
        const slug = `${parentSlug}-${toSlug(node.name)}`
        const id = await upsertCategory({ name: node.name, slug, gender, level, parentId })
        if (node.children?.length) {
            await insertTree(node.children, gender, id, slug, level + 1)
        }
    }
}

async function seedCategories() {
    console.log("Seeding categories...")
    for (const gender of ["women", "men"] as const) {
        await insertTree(buildTop(gender), gender, null, gender, 1)
        console.log(`  ✓ ${gender} tree inserted`)
    }
    const total = await db.$count(category)
    console.log(`✓ categories total in DB: ${total}`)
}

async function main() {
    try {
        await seedCategories()
        console.log("\n✅ Categories seed completed")
    } catch (error) {
        console.error("❌ Seed failed:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
}

main()