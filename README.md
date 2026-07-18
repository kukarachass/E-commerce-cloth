# Otrium — Multi-Brand Fashion Outlet Platform

A full-stack e-commerce platform inspired by [Otrium](https://otrium.com) — a multi-brand outlet
store — built to demonstrate production-grade engineering decisions rather than a CRUD tutorial.

This is a **portfolio project**. The goal wasn't "make a shop that works," it was "make a shop
that survives a webhook arriving twice, a network hiccup mid-refund, and a customer double-clicking
'Pay' on a slow connection." Below is a breakdown of the problems this codebase actually solves, and
how.

> Built with Next.js 16 (App Router, React 19), PostgreSQL + Drizzle ORM, Stripe, Better Auth,
> Upstash QStash and Zustand/TanStack Query on the frontend.

---

## Table of Contents

- [Why this project is interesting](#why-this-project-is-interesting)
- [Tech Stack](#tech-stack)
- [Architecture Deep Dive](#architecture-deep-dive)
  - [1. Payments — Stripe Checkout with idempotent webhooks](#1-payments--stripe-checkout-with-idempotent-webhooks)
  - [2. Reconciliation — the safety net when webhooks don't arrive](#2-reconciliation--the-safety-net-when-webhooks-dont-arrive)
  - [3. Returns & Refunds — a real state machine, not a boolean](#3-returns--refunds--a-real-state-machine-not-a-boolean)
  - [4. Self-service order cancellation](#4-self-service-order-cancellation)
  - [5. Hybrid full-text search — pg_trgm + ILIKE](#5-hybrid-full-text-search--pg_trgm--ilike)
  - [6. Multi-system size engine](#6-multi-system-size-engine)
  - [7. Guest cart → user cart merge](#7-guest-cart--user-cart-merge)
  - [8. Data model decisions worth calling out](#8-data-model-decisions-worth-calling-out)
  - [9. Async jobs & transactional email](#9-async-jobs--transactional-email)
  - [10. Security posture](#10-security-posture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Scripts](#database-scripts)
- [Honest Limitations & Roadmap](#honest-limitations--roadmap)

---

## Why this project is interesting

Most portfolio e-commerce clones stop at "add to cart → Stripe Checkout → thank you page." This one
was built around the assumption that **payments and money are the one place where "it works on my
machine" isn't good enough**. Concretely, that meant designing for:

- Stripe webhooks that arrive **out of order, twice, or never**.
- A customer closing the tab mid-payment, then asking support "where's my money."
- Two return requests racing to refund the same order.
- A guest adding an item to their cart, then logging in — with someone else's cart already existing.
- Twelve different regional sizing systems (UK/EU/US/FR/IT/DE/Waist/Years/…) needing to map to one
  canonical stock row.

The rest of this document walks through how each of those is actually handled in code, with file
references so you can go read the real thing.

## Tech Stack

| Layer            | Choice                                                                 |
|-------------------|-------------------------------------------------------------------------|
| Framework         | Next.js 16 (App Router), React 19, TypeScript                          |
| Database          | PostgreSQL, Drizzle ORM (schema-first, relational query API)           |
| Auth              | Better Auth (email/password + Google & Facebook OAuth), Drizzle adapter |
| Payments          | Stripe (Checkout Sessions, PaymentIntents, Refunds, signed Webhooks)    |
| Async jobs        | Upstash QStash (signed, retried job delivery for emails & reconciliation) |
| Transactional email | Resend                                                                |
| Client state      | Zustand (UI/local state) + TanStack Query (server cache)                |
| Forms/validation  | React Hook Form + Zod                                                  |
| Styling/UI        | Tailwind CSS v4, Framer Motion, Base UI, Lordicon                       |

## Architecture Deep Dive

### 1. Payments — Stripe Checkout with idempotent webhooks

The checkout flow ([`src/actions/checkout/checkout.ts`](src/actions/checkout/checkout.ts)) treats
**stock reservation and order creation as one atomic unit**, separate from the Stripe network call:

1. A single DB transaction locks the relevant `product_size` rows (`SELECT ... FOR UPDATE`, sorted
   by id to avoid deadlocks), verifies stock, decrements it, and inserts the `order` +
   `order_item` rows — all or nothing.
2. **Only after that transaction commits** does the code call `stripe.checkout.sessions.create`,
   passing an **idempotency key** (`checkout-${orderId}`) so a retried request from a flaky network
   never creates a duplicate Checkout Session for the same order.
3. If the Stripe API call itself fails after the DB commit, the code explicitly **compensates** by
   releasing the reserved stock (`releaseStock`) — no orphaned "reserved forever" inventory.

The webhook handler ([`src/app/api/webhooks/stripe/route.ts`](src/app/api/webhooks/stripe/route.ts))
is where most of the interesting engineering lives:

- **Signature verification happens before any database access.** The raw request body (not parsed
  JSON — Stripe signs the raw bytes) is verified against `STRIPE_WEBHOOK_SECRET` via
  `stripe.webhooks.constructEvent`. Invalid signature → 400, no side effects.
- **Every Stripe event is durably logged first** into a `webhook_event` table keyed by Stripe's own
  event id (`evt_...`), via `INSERT ... ON CONFLICT DO NOTHING`. This is the de-duplication
  primitive: Stripe *guarantees at-least-once delivery*, so the same `checkout.session.completed`
  can legitimately arrive twice.
- The actual business logic runs inside a DB transaction that **row-locks the webhook_event record
  (`FOR UPDATE`)** and checks whether it's already `processed`. If yes, it's a no-op — this makes
  the whole webhook handler idempotent even under concurrent delivery of the same event.
- State transitions are driven by two independent enums instead of one giant status field:
  `order_payment_status` (pending → paid/failed/expired/refunded/partially_refunded) and
  `order_fulfillment_status` (unfulfilled → processing → shipped → delivered/cancelled/returned).
  Payment and fulfillment are genuinely orthogonal — collapsing them into one status field is a
  classic source of impossible states ("shipped but unpaid").
- `handleCheckoutCompleted` guards with `if (ord.paymentStatus !== "pending") return` — a
  **monotonicity guard** ensuring a replayed event can never move a `paid` order backward.
- `handleChargeRefunded` distinguishes full vs. partial refunds by comparing
  `charge.amount_refunded` against `charge.amount`, and **deliberately does not auto-restock** —
  refunding money and receiving the physical item back are different real-world events, handled by
  separate code paths.

### 2. Reconciliation — the safety net when webhooks don't arrive

Webhooks are "best effort, at least once" — never "guaranteed, exactly once." If Stripe's webhook
never reaches the app (DNS blip, deploy restart at the wrong millisecond), an order would be stuck
`pending` forever even though the customer was actually charged.

[`src/app/api/jobs/reconcile/reconcileOrder.ts`](src/app/api/jobs/reconcile/reconcileOrder.ts) closes
that gap by **asking Stripe directly** for the ground truth of a Checkout Session and reusing the
exact same idempotent handlers the webhook uses:

- Session `complete` + `paid` but our DB still says `pending` → replay `handleCheckoutCompleted`
  (safe, because it's the same monotonicity-guarded function) and re-enqueue the confirmation email.
- Session `expired` → release the reserved stock.
- Session still `open` → do nothing, Stripe will eventually fire the real webhook.

This is the same pattern used by mature payment integrations (Shopify, Stripe's own docs recommend
it): **webhooks for speed, polling/reconciliation for correctness.**

### 3. Returns & Refunds — a real state machine, not a boolean

Returns are modeled as a two-level structure: a `return_request` ("envelope") containing one or more
`return_item` rows (one per order line, partial quantities allowed). This is what makes partial
returns and per-item decisions possible — a customer can return 1 of 3 identical t-shirts, or return
two different products from the same order for different reasons, in one request.

**Return item lifecycle** (`requested → approved/rejected`, or self-service `cancelled`):

```
requested ──approve──▶ refunded   (Stripe refund succeeded, stock restored)
requested ──reject───▶ rejected   (terminal — blocks the unit forever)
requested ──cancel────▶ cancelled (customer changed their mind before review — unit freed up)
```

Eligibility to *file* a return ([`src/actions/returns/createReturn.ts`](src/actions/returns/createReturn.ts))
checks three independent things server-side (never trusting client input): the order belongs to the
authenticated user, `paymentStatus === "paid" && fulfillmentStatus === "delivered"`, and it's within
the 30-day return window. It then computes **how many units of each line are still returnable** by
subtracting everything already `requested/approved/refunded/rejected` for that line — `cancelled`
returns don't count against the quota, since the customer backed out before any decision was made.

**Processing a return** ([`src/actions/returns/processReturn.ts`](src/actions/returns/processReturn.ts),
admin-gated) is where the money actually moves:

1. Refund amount is computed from the **price snapshot stored on the order item at time of purchase**
   — never from the live product price, so a later price change can't affect historical refunds.
2. `stripe.refunds.create` is called **outside** the DB transaction (never hold a DB lock across a
   network call to a third party), with an idempotency key derived from `returnId + amount` so a
   retried request can't double-refund the same money.
3. Only after Stripe confirms does a DB transaction flip item statuses, **restock exactly once**
   (guarded by a `restocked` boolean so a re-run can't double-credit inventory), close the envelope
   if nothing's left pending, and roll the parent order to `returned` once every line item is fully
   refunded.
4. If the Stripe call succeeds but the DB transaction then fails, the failure is logged as a
   `CRITICAL` error with the refund id attached — an explicit acknowledgment that "money moved,
   database didn't" is the one failure mode that can't be silently swallowed and needs a human to
   reconcile, rather than a fake success response.

### 4. Self-service order cancellation

A separate, simpler flow ([`src/actions/returns/cancelPaidOrder.ts`](src/actions/returns/cancelPaidOrder.ts))
lets a customer cancel an order that's `paid` but not yet picked for fulfillment
(`fulfillmentStatus === "unfulfilled"`) — before it's worth generating a formal return request. It
locks the order row, issues a full Stripe refund with its own idempotency key
(`cancel-refund-${orderId}`), then restocks every line and writes a closed `return_request` purely as
an audit trail. Same "refund first, then persist, log loudly if the second step fails" discipline as
the returns flow above.

### 5. Hybrid full-text search — pg_trgm + ILIKE

[`src/actions/search/search.ts`](src/actions/search/search.ts) implements typeahead search across
products, brands, categories and collections in a single query fan-out, with a strategy that
switches based on query length:

- **Queries ≥ 3 characters** use PostgreSQL's **`pg_trgm`** extension: the `%` similarity operator
  and `similarity()` ranking function, which matches on trigram overlap. This means `"jaket"` still
  finds `"Jacket"` — real fuzzy/typo-tolerant matching, not just substring search — and results are
  ranked by how close the match actually is.
- **Queries of 2 characters** fall back to a plain `ILIKE 'query%' ESCAPE '\'` prefix match (with
  `%`, `_` and `\` explicitly escaped in user input to keep them literal), since trigram similarity
  is unreliable on very short strings.
- All four entity searches (brand/category/collection/product) and the full category tree (needed to
  build breadcrumb-style hrefs) are fired concurrently with `Promise.all` rather than sequentially.
- Product search also matches transitively through **collection membership** via a correlated
  `EXISTS` subquery — searching "summer" surfaces products that belong to a "Summer Essentials"
  collection even if the product name doesn't contain the word.

### 6. Multi-system size engine

Real fashion outlets sell UK, EU, US, French and Italian brands side by side, and a "size" means
something different for jeans (waist/length), sneakers (half-sizes), and dresses (letter sizes).
[`src/lib/size-mapping.ts`](src/lib/size-mapping.ts) encodes this as data, not conditionals:

- Three independent mapping tables — clothing (letter sizes → 8 regional systems, including
  compound `Waist/Length` combos like `W30L32`), footwear (EU half-sizes → UK/US equivalents), and
  accessories (belts/bags/hats measured in cm or letter sizes).
- `resolveCategoryType()` classifies a product's category slug via keyword matching (shoes vs.
  accessories vs. default-clothing) to pick the right table when seeding sizes for a new product.
- `generateSizeRows()` expands one canonical size (e.g. `M`) into **every regional label it's
  equivalent to**, de-duplicated, each becoming its own `product_size` row with independent stock —
  because two labels for the same physical size can still need separate stock counts if a supplier
  ships them as distinct SKUs.
- On the storefront, the size filter round-trips through a compact `"EU:38,INT:M"` query-string
  encoding (parsed by `parseSizeFilter`), letting a shopper filter by their preferred sizing system
  regardless of what system the underlying product was catalogued in — and only sizes with
  `stockAmount > 0` are ever surfaced as filterable.

### 7. Guest cart → user cart merge

Carts work for anonymous visitors first: a random 256-bit token (`randomBytes(32)`) is generated
client-side-adjacent and only its **SHA-256 hash** is ever persisted in the `cart.token` column — the
raw token lives only in an httpOnly cookie, so a database leak doesn't hand out live cart-hijack
tokens ([`src/actions/cart/make-cart-token.ts`](src/actions/cart/make-cart-token.ts)).

On login/signup, a Better Auth `after` hook ([`src/lib/auth.ts`](src/lib/auth.ts)) reads the guest
cart cookie and merges it into the user's cart inside a transaction
([`src/actions/cart/cart-merge.ts`](src/actions/cart/cart-merge.ts)), handling every real-world edge
case explicitly:

- Neither cart exists → create one, with `ON CONFLICT DO NOTHING` on `userId` to survive a race
  where two concurrent requests both try to create the first cart for that user.
- Only a user cart exists → keep it as-is.
- Only a guest cart exists → reassign it to the user (again racing safely against a unique
  constraint, falling back to the existing row on conflict).
- Both exist → merge line-by-line: matching `productSizeId` quantities are **summed and then
  clamped to live stock** (`Math.min(mergedQuantity, stockAmount)`), a size that's since gone
  out of stock in the guest cart is silently dropped rather than crashing the login flow, and the
  now-empty guest cart is deleted.

### 8. Data model decisions worth calling out

The schema ([`src/db/schema.ts`](src/db/schema.ts)) has a handful of deliberate choices that aren't
obvious from a glance:

- **Money is stored as integer cents in `payment`/refund fields**, matching Stripe's own
  representation exactly — no floating-point cents-vs-dollars bugs when reconciling against Stripe's
  API. (Catalog-facing prices use `decimal(10,2)` for display, since they never need to match a
  third-party ledger.)
- **Historical snapshots everywhere money or fulfillment is involved**: `order.addressSnapshot` and
  `orderItem.productSnapshot` freeze the shipping address and product name/price *as they were at
  purchase time*, so editing or deleting a product/address later never rewrites history on past
  orders.
- **A partial unique index enforces "at most one pending order per cart"**
  (`uniqueIndex(...).where(sql`payment_status = 'pending'`)`) — a database-level constraint, not
  application logic, preventing double-checkout race conditions from ever producing two live orders
  for the same cart.
- **`store_config` is a deliberately single-row table**, enforced with a `CHECK (id = 1)` constraint
  — a lightweight, foot-gun-proof way to store global settings (shipping fee, free-shipping
  threshold) without a key-value table or a singleton pattern in application code.
- **Soft deletes via `isActive`** on `brand`/`product`/`collection` mean discontinuing a product
  never breaks a historical order's referential integrity or a customer's order history page.
- Every foreign key that represents "this row's lifetime is tied to its parent" cascades on delete
  (e.g. `cartItem` → `cart`); every foreign key that represents **audit history** deliberately does
  **not** cascade (e.g. `returnRequest` → `order` has no `onDelete`, so return history is never
  silently wiped).

### 9. Async jobs & transactional email

Order confirmation emails are decoupled from the request/response cycle via **Upstash QStash**
([`src/lib/qstash/qstash.ts`](src/lib/qstash/qstash.ts)): the webhook handler enqueues a job rather
than calling Resend inline, so a slow or down email provider can never delay a Stripe webhook
response (Stripe retries webhooks that don't 200 quickly, which would otherwise risk duplicate
processing).

- The job endpoint ([`src/app/api/jobs/order-confirmation/route.ts`](src/app/api/jobs/order-confirmation/route.ts))
  is wrapped in `verifySignatureAppRouter`, which checks QStash's signing keys before the handler
  runs — so it can't be triggered by an arbitrary POST from the internet.
- QStash itself provides retry-with-backoff (`retries: 3`); the handler is written to be safely
  retried by checking `order.confirmationSentAt` first and short-circuiting if the email already
  went out — idempotent by construction, not by luck.

### 10. Security posture

A rollup of the security-relevant decisions threaded through the codebase above:

- **Secrets never reach the client bundle.** `src/lib/stripe/stripe.ts` imports the `server-only`
  package specifically so any accidental import from a Client Component fails the build instead of
  leaking `STRIPE_SECRET_KEY` into browser JS. The same guard is used for the QStash client and the
  email sender.
- **Stripe webhook payloads are cryptographically verified** against the raw request body before a
  single byte of it is trusted or written to the database.
- **QStash job endpoints are signature-verified**, not "security by obscure URL."
- **All money-moving server actions re-derive identity server-side** from the session
  (`getServerSession()`) — client-supplied user/cart/order ids are always cross-checked against
  ownership (`eq(order.userId, session.user.id)`) before any read or write, never trusted at face
  value.
- **Every concurrent-money-path uses row-level locking** (`SELECT ... FOR UPDATE`) plus **Stripe
  idempotency keys** on every write call to Stripe (checkout creation, refunds) — the two mechanisms
  together are what make double-submits, retried requests, and concurrent webhook delivery safe by
  construction instead of "probably fine."
- **Guest identity uses a hashed, httpOnly-cookie token** rather than a raw guessable id — see
  [cart merge](#7-guest-cart--user-cart-merge) above.
- Fail-fast startup checks (e.g. `stripe.ts` throws immediately if `STRIPE_SECRET_KEY` is missing)
  turn a misconfigured deploy into an obvious boot failure instead of a silent 500 on the first
  customer's checkout.

**How this was verified**: there's no automated test suite yet (see
[Limitations](#honest-limitations--roadmap)) — the flows above were exercised manually against
Stripe's test-mode webhooks and CLI (`stripe trigger`, `stripe listen --forward-to`), including
deliberately replaying the same webhook event twice, killing the dev server mid-checkout to force
the reconciliation job to run, and firing overlapping return/cancel requests against the same order
to confirm the row locks actually prevent double refunds.

## Project Structure

```
src/
├── actions/          # Server Actions — the actual business logic, grouped by domain
│   ├── cart/          # guest/user cart, merge, quantity mutations
│   ├── checkout/      # stock reservation, Stripe session creation, webhook handlers, reconciliation glue
│   ├── returns/        # return request lifecycle, admin processing, self-service cancellation
│   ├── search/         # pg_trgm/ILIKE hybrid search
│   ├── filters/         # brand/color/pattern/style/size/price/discount facets
│   ├── products/, category/, collection/, favourites/, order/, profile/
├── app/               # Next.js App Router
│   ├── (main)/          # storefront: catalog, product, cart, favourites, per-gender routing
│   ├── account/         # orders, returns, profile (auth-gated)
│   ├── checkout/        # multi-step checkout + success page
│   ├── api/webhooks/stripe/   # Stripe webhook endpoint
│   └── api/jobs/               # QStash-triggered background jobs (email, reconciliation)
├── db/
│   ├── schema.ts        # Drizzle schema — single source of truth for the data model
│   └── seed-*.ts         # seeding scripts for demo catalog data
├── lib/
│   ├── stripe/, qstash/, email/     # third-party integrations, all server-only
│   ├── returns/                       # return state-machine helpers
│   ├── size-mapping.ts                # multi-region size engine
│   └── auth.ts                         # Better Auth config + cart-merge hook
├── components/        # ~200 React components, organized by feature area
├── store/              # Zustand stores (UI/local state only — never server state)
├── hooks/              # data-fetching hooks (TanStack Query) + UI hooks
└── types/              # shared domain types
```

## Getting Started

```bash
npm install
cp .env.example .env   # fill in the variables below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For local Stripe webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (requires the `pg_trgm` extension enabled: `CREATE EXTENSION IF NOT EXISTS pg_trgm;`) |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth core config |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `FACEBOOK_CLIENT_ID` / `FACEBOOK_CLIENT_SECRET` | Facebook OAuth |
| `STRIPE_SECRET_KEY` | Stripe server-side API key |
| `STRIPE_WEBHOOK_SECRET` | Verifies `stripe-signature` on incoming webhooks |
| `QSTASH_URL`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` | Upstash QStash — job queue + signature verification |
| `RESEND_API_KEY` | Transactional email (order confirmations) |
| `APP_URL` | Base URL used for Stripe redirect URLs and QStash job callbacks |

## Database Scripts

```bash
npm run seed:categories     # category tree (gender-scoped, nested)
npm run seed:brand-tags     # brands + tag metadata
npm run seed:products       # products with pricing/description
npm run seed:images         # product image sets
npm run seed:collections    # curated collections
npm run debug               # ad-hoc query sandbox
```

Schema changes are managed with `drizzle-kit` (`drizzle.config.ts` → `src/db/schema.ts`); the schema
is the single source of truth and is pushed directly to the database during active development.

## Honest Limitations & Roadmap

In the interest of not overselling this: a few things are intentionally simplified for a portfolio
scope, and calling them out is more useful than pretending they don't exist.

- **No automated test suite yet.** The critical money paths (checkout, webhooks, refunds, returns)
  were verified manually with Stripe's test tooling as described [above](#10-security-posture); a
  Vitest suite around the transaction-heavy Server Actions, plus Playwright coverage of the checkout
  and returns flows, is the natural next step.
- **Admin authorization is currently a stub** (`isAdmin()` returns `true` for any authenticated user)
  — the return-approval flow is fully built and gated in code, but real role-based access control
  (an `is_admin` flag or roles table) isn't wired in yet.
- **Delivery/shipment tracking isn't modeled** beyond the `fulfillmentStatus` enum — no carrier
  integration.
- **Single currency (EUR)** end-to-end, even though the schema (`payment.currency`,
  `returnRequest.currency`) is already shaped to support more.
