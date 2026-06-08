import {
    pgTable,
    text,
    uuid,
    boolean,
    integer,
    decimal,
    timestamp,
    unique,
    index,
    json,
    date,
} from "drizzle-orm/pg-core"
import {relations} from "drizzle-orm"

// ============================================================
// ██╗   ██╗███████╗███████╗██████╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗
// ██║   ██║███████╗█████╗  ██████╔╝
// ██║   ██║╚════██║██╔══╝  ██╔══██╗
// ╚██████╔╝███████║███████╗██║  ██║
//  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
// ============================================================

// Better Auth создаёт id как text, не uuid
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    lastName: text("last_name"),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    phoneNumber: text("phone_number"),
    dateOfBirth: date("date_of_birth"),
    gender: text("gender"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

// Better Auth таблицы — не трогать
export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
}, (t) => [index("session_user_idx").on(t.userId)])

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull(),
}, (t) => [index("account_user_idx").on(t.userId)])

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => [index("verification_identifier_idx").on(t.identifier)])

// ============================================================
// ██╗      ██████╗  ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
// ██║     ██╔═══██╗██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
// ██║     ██║   ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║
// ██║     ██║   ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
// ███████╗╚██████╔╝╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
// ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
// ============================================================

// Адрес вынесен отдельно — у юзера может быть несколько адресов.
// isDefault — адрес по умолчанию при оформлении заказа.
// При заказе адрес копируется в addressSnapshot — чтобы история не менялась.
export const address = pgTable("address", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    street: text("street").notNull(),
    houseNumber: text("house_number").notNull(),
    houseAddition: text("house_addition"),
    postcode: text("postcode").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull().default("Netherlands"),
    isDefault: boolean("is_default").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ============================================================
// ██████╗ ██████╗  █████╗ ███╗   ██╗██████╗
// ██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔══██╗
// ██████╔╝██████╔╝███████║██╔██╗ ██║██║  ██║
// ██╔══██╗██╔══██╗██╔══██║██║╚██╗██║██║  ██║
// ██████╔╝██║  ██║██║  ██║██║ ╚████║██████╔╝
// ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝
// ============================================================

// slug — уникальный URL (/brands/nike).
// isActive — скрыть бренд без удаления из БД.
export const brand = pgTable("brand", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    logo: text("logo"),
    tags: text("tags").array().default([]).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

export const favoriteBrand = pgTable("favorite_brand", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    brandId: uuid("brand_id").notNull().references(() => brand.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
    unique().on(t.userId, t.brandId)
])

// ============================================================
//  ██████╗ █████╗ ████████╗███████╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
// ██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔════╝ ██╔═══██╗██╔══██╗╚██╗ ██╔╝
// ██║     ███████║   ██║   █████╗  ██║  ███╗██║   ██║██████╔╝ ╚████╔╝
// ██║     ██╔══██║   ██║   ██╔══╝  ██║   ██║██║   ██║██╔══██╗  ╚██╔╝
// ╚██████╗██║  ██║   ██║   ███████╗╚██████╔╝╚██████╔╝██║  ██║   ██║
//  ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝
// ============================================================

// parentId — для вложенности: Clothing → Jeans → Straight Jeans.
// gender — women/men/unisex для роутинга [gender]/[category].
// slug строится как: women-clothing, women-clothing-jeans
export const category = pgTable("category", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    image: text("image"),
    gender: text("gender"),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ============================================================
// ██████╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗ ██████╗████████╗
// ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██║   ██║██╔════╝╚══██╔══╝
// ██████╔╝██████╔╝██║   ██║██║  ██║██║   ██║██║        ██║
// ██╔═══╝ ██╔══██╗██║   ██║██║  ██║██║   ██║██║        ██║
// ██║     ██║  ██║╚██████╔╝██████╔╝╚██████╔╝╚██████╗   ██║
// ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝   ╚═╝
// ============================================================

// originalPrice — зачёркнутая цена (было).
// discountPrice — актуальная цена со скидкой (стало).
// discount — процент скидки (75) для фильтра "Discount".
// isActive — мягкое удаление. Заказы с продуктом остаются валидными.
export const product = pgTable("product", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    shortDescription: text("short_description"),
    description: text("description"),
    originalPrice: decimal("original_price", {precision: 10, scale: 2}).notNull(),
    discountPrice: decimal("discount_price", {precision: 10, scale: 2}).notNull(),
    discount: integer("discount").default(0).notNull(),
    material: text("material"),
    careInstructions: text("care_instructions"),
    gender: text("gender").notNull(),
    brandId: uuid("brand_id").notNull().references(() => brand.id),
    categoryId: uuid("category_id").notNull().references(() => category.id),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => [
    index("product_brand_idx").on(t.brandId),
    index("product_category_idx").on(t.categoryId),
    index("product_gender_idx").on(t.gender),
])

// Размеры — отдельная таблица потому что у каждого размера свой stockAmount.
// При добавлении в корзину проверяем stockAmount конкретного размера.
// unique(productId, size) — нельзя создать два одинаковых размера для продукта.
export const productSize = pgTable("product_size", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => product.id, {onDelete: "cascade"}),
    size: text("size").notNull(),
    stockAmount: integer("stock_amount").notNull().default(0),
}, (t) => [unique().on(t.productId, t.size)])

// Изображения — отдельная таблица потому что у одного продукта несколько фото.
// isMain — главное фото для превью в каталоге.
// order — порядок в галерее продукта.
export const productImage = pgTable("product_image", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => product.id, {onDelete: "cascade"}),
    url: text("url").notNull(),
    isMain: boolean("is_main").default(false).notNull(),
    order: integer("order").default(0).notNull(),
})

// ============================================================
// ФИЛЬТРЫ — справочники для фильтрации продуктов
// Отдельные таблицы для many-to-many связей.
// Один продукт может иметь несколько цветов, паттернов, стилей.
// ============================================================

export const color = pgTable("color", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    hex: text("hex").notNull().unique(), // "#000000" — для отображения кружка цвета в фильтре
})

export const pattern = pgTable("pattern", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
})

export const style = pgTable("style", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
})

// Промежуточные таблицы many-to-many
// unique(productId, colorId) — нельзя добавить один цвет дважды к одному продукту
export const productColor = pgTable("product_color", {
    productId: uuid("product_id").notNull().references(() => product.id, {onDelete: "cascade"}),
    colorId: uuid("color_id").notNull().references(() => color.id, {onDelete: "cascade"}),
}, (t) => [unique().on(t.productId, t.colorId)])

export const productPattern = pgTable("product_pattern", {
    productId: uuid("product_id").notNull().references(() => product.id, {onDelete: "cascade"}),
    patternId: uuid("pattern_id").notNull().references(() => pattern.id, {onDelete: "cascade"}),
}, (t) => [unique().on(t.productId, t.patternId)])

export const productStyle = pgTable("product_style", {
    productId: uuid("product_id").notNull().references(() => product.id, {onDelete: "cascade"}),
    styleId: uuid("style_id").notNull().references(() => style.id, {onDelete: "cascade"}),
}, (t) => [unique().on(t.productId, t.styleId)])

export const favoriteProduct = pgTable("favorite_product", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, {onDelete: "cascade"}),
    productId: uuid("product_id").notNull().references(() => product.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
    unique().on(t.userId, t.productId)
])

export const collection = pgTable("collection", {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    banner: text("banner"),
    gender: text("gender").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

// Связующая таблица коллекция ↔ продукт (many-to-many)
export const collectionProduct = pgTable("collection_product", {
    collectionId: uuid("collection_id").notNull().references(() => collection.id, {onDelete: "cascade"}),
    productId: uuid("product_id").notNull().references(() => product.id, {onDelete: "cascade"}),
}, (t) => [
    unique().on(t.collectionId, t.productId)
])

// ============================================================
//  ██████╗ █████╗ ██████╗ ████████╗
// ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝
// ██║     ███████║██████╔╝   ██║
// ██║     ██╔══██║██╔══██╗   ██║
// ╚██████╗██║  ██║██║  ██║   ██║
//  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
// ============================================================

// token — UUID для гостевой корзины, хранится в cookie.
// userId — null для гостя, заполняется при логине.
// totalAmount — кэшированная сумма, пересчитывается при каждом изменении.
export const cart = pgTable("cart", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").unique().references(() => user.id, {onDelete: "cascade"}),
    token: text("token").unique(),
    totalAmount: decimal("total_amount", {precision: 10, scale: 2}).notNull().default("0"),
    grandTotal: decimal("grand_total", { precision: 10, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

// size — размер выбранного продукта на момент добавления в корзину.
// unique(cartId, productId, size) — нельзя добавить один продукт+размер дважды.
export const cartItem = pgTable("cart_item", {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id").notNull().references(() => cart.id, {onDelete: "cascade"}),
    productId: uuid("product_id").notNull().references(() => product.id, {onDelete: "cascade"}),
    priceAtAddition: decimal("price_at_addition", { precision: 10, scale: 2 }).notNull(), // ← добавляем
    quantity: integer("quantity").notNull().default(1),
    productSizeId: uuid("product_size_id").notNull().references(() => productSize.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [unique().on(t.cartId, t.productId, t.productSizeId)])

// ============================================================
// ██████╗ ██████╗ ██████╗ ███████╗██████╗
// ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗
// ██║   ██║██████╔╝██║  ██║█████╗  ██████╔╝
// ██║   ██║██╔══██╗██║  ██║██╔══╝  ██╔══██╗
// ╚██████╔╝██║  ██║██████╔╝███████╗██║  ██║
//  ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝
// ============================================================

// addressSnapshot — JSON копия адреса на момент заказа.
// Юзер может изменить/удалить адрес — заказ хранит оригинал.
// stripePaymentIntentId — для подтверждения оплаты через webhook и возвратов.
// status: pending → paid → processing → shipped → delivered / cancelled / refunded
export const order = pgTable("order", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id),
    addressSnapshot: json("address_snapshot").notNull(),
    totalAmount: decimal("total_amount", {precision: 10, scale: 2}).notNull(),
    deliveryFee: decimal("delivery_fee", {precision: 10, scale: 2}).notNull().default("0"),
    deliveryType: text("delivery_type").notNull().default("standard"),
    deliveryTime: text("delivery_time"),
    status: text("status").notNull().default("pending"),
    comment: text("comment"),
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (t) => [
    index("order_user_idx").on(t.userId),
    index("order_status_idx").on(t.status),
])

// price — цена продукта на момент заказа.
// productSnapshot — JSON копия продукта. Если продукт удалят или изменят —
// в заказе останутся оригинальные название, цена и фото.
export const orderItem = pgTable("order_item", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => order.id, {onDelete: "cascade"}),
    productId: uuid("product_id").notNull().references(() => product.id),
    quantity: integer("quantity").notNull(),
    size: text("size").notNull(),
    price: decimal("price", {precision: 10, scale: 2}).notNull(),
    productSnapshot: json("product_snapshot").notNull(),
})

// ============================================================
// RELATIONS
// Не создают таблицы в БД — только инструкции для Drizzle
// чтобы работало with: {} в запросах.
// ============================================================

// ============================================================
//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝
// ============================================================

export const storeConfig = pgTable("store_config", {
    shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).notNull().default("6.99"),
    freeShippingThreshold: decimal("free_shipping_threshold", { precision: 10, scale: 2 }).notNull().default("500"),
    isFreeShippingEnabled: boolean("is_free_shipping_enabled").notNull().default(true),
    customsFee: decimal("customs_fee", { precision: 10, scale: 2 }).notNull().default("9.99"),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

// --- USER ---
export const userRelations = relations(user, ({one, many}) => ({
    sessions: many(session),
    accounts: many(account),
    addresses: many(address),
    orders: many(order),
    cart: one(cart, { fields: [user.id], references: [cart.userId] }), // ← one, не many
}))

export const sessionRelations = relations(session, ({one}) => ({
    user: one(user, {fields: [session.userId], references: [user.id]}),
}))

export const accountRelations = relations(account, ({one}) => ({
    user: one(user, {fields: [account.userId], references: [user.id]}),
}))

export const addressRelations = relations(address, ({one}) => ({
    user: one(user, {fields: [address.userId], references: [user.id]}),
}))

// --- BRAND ---
export const brandRelations = relations(brand, ({many}) => ({
    products: many(product),
}))

// --- CATEGORY ---
export const categoryRelations = relations(category, ({many, one}) => ({
    products: many(product),
    parent: one(category, {fields: [category.parentId], references: [category.id], relationName: "subcategories"}),
    subcategories: many(category, {relationName: "subcategories"}),
}))

// --- PRODUCT ---
export const productRelations = relations(product, ({one, many}) => ({
    brand: one(brand, {fields: [product.brandId], references: [brand.id]}),
    category: one(category, {fields: [product.categoryId], references: [category.id]}),
    sizes: many(productSize),
    images: many(productImage),
    colors: many(productColor),
    patterns: many(productPattern),
    styles: many(productStyle),
    cartItems: many(cartItem),
    orderItems: many(orderItem),
}))

export const productSizeRelations = relations(productSize, ({one}) => ({
    product: one(product, {fields: [productSize.productId], references: [product.id]}),
}))

export const productImageRelations = relations(productImage, ({one}) => ({
    product: one(product, {fields: [productImage.productId], references: [product.id]}),
}))

// --- ФИЛЬТРЫ ---
export const colorRelations = relations(color, ({many}) => ({
    products: many(productColor),
}))

export const patternRelations = relations(pattern, ({many}) => ({
    products: many(productPattern),
}))

export const styleRelations = relations(style, ({many}) => ({
    products: many(productStyle),
}))

export const productColorRelations = relations(productColor, ({one}) => ({
    product: one(product, {fields: [productColor.productId], references: [product.id]}),
    color: one(color, {fields: [productColor.colorId], references: [color.id]}),
}))

export const productPatternRelations = relations(productPattern, ({one}) => ({
    product: one(product, {fields: [productPattern.productId], references: [product.id]}),
    pattern: one(pattern, {fields: [productPattern.patternId], references: [pattern.id]}),
}))

export const productStyleRelations = relations(productStyle, ({one}) => ({
    product: one(product, {fields: [productStyle.productId], references: [product.id]}),
    style: one(style, {fields: [productStyle.styleId], references: [style.id]}),
}))

// --- CART ---
export const cartRelations = relations(cart, ({one, many}) => ({
    user: one(user, {fields: [cart.userId], references: [user.id]}),
    items: many(cartItem),
}))

export const cartItemRelations = relations(cartItem, ({one}) => ({
    cart: one(cart, {fields: [cartItem.cartId], references: [cart.id]}),
    product: one(product, {fields: [cartItem.productId], references: [product.id]}),
    productSize: one(productSize, {
        fields: [cartItem.productSizeId], references: [productSize.id],
    }),
}))

// --- ORDER ---
export const orderRelations = relations(order, ({one, many}) => ({
    user: one(user, {fields: [order.userId], references: [user.id]}),
    items: many(orderItem),
}))

export const orderItemRelations = relations(orderItem, ({one}) => ({
    order: one(order, {fields: [orderItem.orderId], references: [order.id]}),
    product: one(product, {fields: [orderItem.productId], references: [product.id]}),
}))

export const favoriteProductRelations = relations(favoriteProduct, ({one}) => ({
    product: one(product, {fields: [favoriteProduct.productId], references: [product.id]}),
    user: one(user, {fields: [favoriteProduct.userId], references: [user.id]}),
}))

export const favoriteBrandRelations = relations(favoriteBrand, ({one}) => ({
    brand: one(brand, {fields: [favoriteBrand.brandId], references: [brand.id]}),
    user: one(user, {fields: [favoriteBrand.userId], references: [user.id]}),
}))

export const collectionRelations = relations(collection, ({many}) => ({
    products: many(collectionProduct),
}))

export const collectionProductRelations = relations(collectionProduct, ({one}) => ({
    collection: one(collection, {fields: [collectionProduct.collectionId], references: [collection.id]}),
    product: one(product, {fields: [collectionProduct.productId], references: [product.id]}),
}))