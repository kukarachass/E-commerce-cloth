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

import { relations } from "drizzle-orm"

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    lastName: text("lastName"),
    dateOfBirth: date("date_of_birth"),
    gender: text("gender"),
    street: text("street"),
    houseNumber: text("houseNumber"),
    houseAddition: text("houseAddition"),
    postcode: text("postcode"),
    city: text("city"),
    phoneNumber: text("phoneNumber"),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable("session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);
// ============================================================
// ADDRESS
// Отдельная таблица для адресов.
// Юзер может иметь несколько адресов (домашний, рабочий).
// isDefault — адрес по умолчанию при чекауте.
// ============================================================
export const address = pgTable("address", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    phoneNumber: text("phone_number").notNull(),
    street: text("street").notNull(),
    houseNumber: text("house_number").notNull(),
    houseAddition: text("house_addition"),
    postcode: text("postcode").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull().default("Netherlands"),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ============================================================
// BRAND
// slug — уникальный URL бренда (/brands/nike).
// Уникальный чтобы два бренда не имели одинаковый URL.
// ============================================================
export const brand = pgTable("brand", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    logo: text("logo"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

// ============================================================
// CATEGORY
// parentId — для вложенных категорий (Clothing → Jeans).
// gender — women/men/unisex для роутинга [gender]/[category].
// ============================================================
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
// PRODUCT
// originalPrice — зачёркнутая цена.
// discountPrice — актуальная цена со скидкой.
// discount — процент скидки (75) для фильтрации.
// isActive — мягкое удаление, заказы остаются валидными.
// ============================================================
export const product = pgTable("product", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    shortDescription: text("short_description"),
    description: text("description"),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
    discountPrice: decimal("discount_price", { precision: 10, scale: 2 }).notNull(),
    discount: integer("discount").default(0).notNull(),
    material: text("material"),
    careInstructions: text("care_instructions"),
    color: text("color"),
    pattern: text("pattern"),
    style: text("style"),
    gender: text("gender").notNull(),
    brandId: uuid("brand_id").notNull().references(() => brand.id),
    categoryId: uuid("category_id").notNull().references(() => category.id),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
    index("product_brand_idx").on(table.brandId),
    index("product_category_idx").on(table.categoryId),
    index("product_gender_idx").on(table.gender),
])

// ============================================================
// PRODUCT SIZE
// Отдельная таблица потому что у каждого размера
// своё количество на складе.
// При добавлении в корзину проверяем stockAmount размера.
// ============================================================
export const productSize = pgTable("product_size", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
    size: text("size").notNull(),
    stockAmount: integer("stock_amount").notNull().default(0),
}, (table) => [
    unique().on(table.productId, table.size),
])

// ============================================================
// PRODUCT IMAGE
// Отдельная таблица потому что у одного продукта
// несколько фотографий.
// isMain — главная фотография для превью в каталоге.
// order — порядок отображения в галерее.
// ============================================================
export const productImage = pgTable("product_image", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    isMain: boolean("is_main").default(false).notNull(),
    order: integer("order").default(0).notNull(),
})

// ============================================================
// CART
// token — для гостевой корзины, хранится в cookie.
// userId — необязательный, гость не имеет аккаунта.
// totalAmount — кэшированная сумма, обновляется при изменениях.
// ============================================================
export const cart = pgTable("cart", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").unique().references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
})

// ============================================================
// CART ITEM
// size — размер выбранного продукта.
// unique на [cartId, productId, size] — нельзя добавить
// один продукт одного размера дважды, только quantity растёт.
// ============================================================
export const cartItem = pgTable("cart_item", {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id").notNull().references(() => cart.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    size: text("size").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
    unique().on(table.cartId, table.productId, table.size),
])

// ============================================================
// ORDER
// addressSnapshot — JSON снимок адреса на момент заказа.
// Даже если юзер удалит адрес — в заказе он останется.
// stripePaymentIntentId — для подтверждения оплаты и возвратов.
// status — жизненный цикл: pending → paid → processing
//           → shipped → delivered / cancelled / refunded
// ============================================================
export const order = pgTable("order", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id),
    addressSnapshot: json("address_snapshot").notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
    deliveryType: text("delivery_type").notNull().default("standard"),
    deliveryTime: text("delivery_time"),
    status: text("status").notNull().default("pending"),
    comment: text("comment"),
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
    index("order_user_idx").on(table.userId),
    index("order_status_idx").on(table.status),
])

// ============================================================
// ORDER ITEM
// price — цена продукта на момент заказа.
// Хранится отдельно потому что цена может измениться,
// но юзер должен видеть ту цену по которой купил.
// ============================================================
export const orderItem = pgTable("order_item", {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => order.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => product.id),
    quantity: integer("quantity").notNull(),
    size: text("size").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    productSnapshot: json("product_snapshot").notNull(),
})

export const addressRelations = relations(address, ({ one }) => ({
    user: one(user, { fields: [address.userId], references: [user.id] }),
}))

export const brandRelations = relations(brand, ({ many }) => ({
    products: many(product),
}))

export const categoryRelations = relations(category, ({ many, one }) => ({
    products: many(product),
    parent: one(category, { fields: [category.parentId], references: [category.id], relationName: "subcategories" }),
    subcategories: many(category, { relationName: "subcategories" }),
}))

export const productRelations = relations(product, ({ one, many }) => ({
    brand: one(brand, { fields: [product.brandId], references: [brand.id] }),
    category: one(category, { fields: [product.categoryId], references: [category.id] }),
    sizes: many(productSize),
    images: many(productImage),
    cartItems: many(cartItem),
    orderItems: many(orderItem),
}))

export const productSizeRelations = relations(productSize, ({ one }) => ({
    product: one(product, { fields: [productSize.productId], references: [product.id] }),
}))

export const productImageRelations = relations(productImage, ({ one }) => ({
    product: one(product, { fields: [productImage.productId], references: [product.id] }),
}))

export const cartRelations = relations(cart, ({ one, many }) => ({
    user: one(user, { fields: [cart.userId], references: [user.id] }),
    items: many(cartItem),
}))

export const cartItemRelations = relations(cartItem, ({ one }) => ({
    cart: one(cart, { fields: [cartItem.cartId], references: [cart.id] }),
    product: one(product, { fields: [cartItem.productId], references: [product.id] }),
}))

export const orderRelations = relations(order, ({ one, many }) => ({
    user: one(user, { fields: [order.userId], references: [user.id] }),
    items: many(orderItem),
}))

export const orderItemRelations = relations(orderItem, ({ one }) => ({
    order: one(order, { fields: [orderItem.orderId], references: [order.id] }),
    product: one(product, { fields: [orderItem.productId], references: [product.id] }),
}))

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));