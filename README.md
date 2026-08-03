# Otrium — Multi-Brand Fashion Outlet Platform

A full-stack e-commerce platform inspired by [Otrium](https://otrium.com) — a multi-brand outlet
store — built to demonstrate production-grade engineering decisions rather than a CRUD tutorial.

This is a **portfolio project**. The goal wasn't "make a shop that works," it was "make a shop
that survives a webhook arriving twice, a network hiccup mid-refund, and a customer double-clicking
'Pay' on a slow connection." It ships with two halves: a customer-facing storefront, and a full
back-office console at `/admin` where the catalog is edited, orders are packed, returns are refunded
and every admin action is written to an audit trail. Below is a breakdown of the problems this
codebase actually solves, and how.

> Built with Next.js 16 (App Router, React 19), PostgreSQL + Drizzle ORM, Stripe, Better Auth,
> Upstash QStash, Supabase Storage, and Zustand/TanStack Query on the frontend.

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
- [The Admin Console](#the-admin-console)
  - [Access control](#access-control)
  - [Dashboard](#dashboard)
  - [Orders workbench](#orders-workbench)
  - [Returns desk](#returns-desk)
  - [Catalog](#catalog)
  - [Customers](#customers)
  - [Audit log](#audit-log)
  - [Media uploads](#media-uploads)
  - [Front-end architecture of the console](#front-end-architecture-of-the-console)
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
- An operator who has to answer "which orders are waiting to be packed right now?" ten times a day,
  and whose mistakes need to be traceable after the fact.

The rest of this document walks through how each of those is actually handled in code, with file
references so you can go read the real thing.

## Tech Stack

| Layer            | Choice                                                                 |
|-------------------|-------------------------------------------------------------------------|
| Framework         | Next.js 16 (App Router), React 19, TypeScript                          |
| Database          | PostgreSQL, Drizzle ORM (schema-first, relational query API)           |
| Auth              | Better Auth (email/password + Google & Facebook OAuth), admin plugin with access control, Drizzle adapter |
| Payments          | Stripe (Checkout Sessions, PaymentIntents, Refunds, signed Webhooks)    |
| Async jobs        | Upstash QStash (signed, retried job delivery for emails & reconciliation) |
| File storage      | Supabase Storage (product/brand imagery, service-role key server-side only) |
| Transactional email | Resend                                                                |
| Client state      | Zustand (UI/local state) + TanStack Query (server cache)                |
| Forms/validation  | React Hook Form + Zod (storefront), Server Actions + Zod (admin)        |
| Styling/UI        | Tailwind CSS v4, Framer Motion, Base UI, Lordicon, lucide-react          |

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

The webhook handler ([`src/app/(shop)/api/webhooks/stripe/route.ts`](src/app/(shop)/api/webhooks/stripe/route.ts))
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

[`src/app/(shop)/api/jobs/reconcile/reconcileOrder.ts`](src/app/(shop)/api/jobs/reconcile/reconcileOrder.ts)
closes that gap by **asking Stripe directly** for the ground truth of a Checkout Session and reusing
the exact same idempotent handlers the webhook uses:

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
requested ──approve──▶ approved ──restock──▶ refunded   (Stripe refund succeeded)
requested ──reject───▶ rejected                         (terminal — blocks the unit forever)
requested ──cancel────▶ cancelled                       (customer backed out — unit freed up)
```

Eligibility to *file* a return ([`src/actions/returns/createReturn.ts`](src/actions/returns/createReturn.ts))
checks three independent things server-side (never trusting client input): the order belongs to the
authenticated user, `paymentStatus === "paid" && fulfillmentStatus === "delivered"`, and it's within
the 30-day return window. It then computes **how many units of each line are still returnable** by
subtracting everything already `requested/approved/refunded/rejected` for that line — `cancelled`
returns don't count against the quota, since the customer backed out before any decision was made.

**Processing a return** ([`src/actions/returns/processReturn.ts`](src/actions/returns/processReturn.ts))
is where the money actually moves:

1. Refund amount is computed from the **price snapshot stored on the order item at time of purchase**
   — never from the live product price, so a later price change can't affect historical refunds.
2. `stripe.refunds.create` is called **outside** the DB transaction (never hold a DB lock across a
   network call to a third party), with an idempotency key derived from the return id so a
   retried request can't double-refund the same money.
3. Only after Stripe confirms does a DB transaction flip item statuses, **restock exactly once**
   (guarded by a `restocked` boolean so a re-run can't double-credit inventory), close the envelope
   if nothing's left pending, and roll the parent order to `returned` once every line item is fully
   refunded.
4. If the Stripe call succeeds but the DB transaction then fails, the failure is logged as a
   `CRITICAL` error with the refund id attached — an explicit acknowledgment that "money moved,
   database didn't" is the one failure mode that can't be silently swallowed and needs a human to
   reconcile, rather than a fake success response.

The operator-facing side of the same state machine lives in the admin console — see
[Returns desk](#returns-desk).

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
- **`audit_log.actorId` is `ON DELETE SET NULL`, but `actorEmail` is a plain text column** —
  deleting an admin account must not erase the record of what they did, and the log has to stay
  readable afterwards.
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

- The job endpoint ([`src/app/(shop)/api/jobs/order-confirmation/route.ts`](src/app/(shop)/api/jobs/order-confirmation/route.ts))
  is wrapped in `verifySignatureAppRouter`, which checks QStash's signing keys before the handler
  runs — so it can't be triggered by an arbitrary POST from the internet.
- QStash itself provides retry-with-backoff (`retries: 3`); the handler is written to be safely
  retried by checking `order.confirmationSentAt` first and short-circuiting if the email already
  went out — idempotent by construction, not by luck.

### 10. Security posture

A rollup of the security-relevant decisions threaded through the codebase above:

- **Secrets never reach the client bundle.** `src/lib/stripe/stripe.ts` imports the `server-only`
  package specifically so any accidental import from a Client Component fails the build instead of
  leaking `STRIPE_SECRET_KEY` into browser JS. The same guard protects the QStash client, the email
  sender, and the Supabase **service-role** key used for image uploads.
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
- **The admin surface is authorized per request, not per route** — see [Access control](#access-control).
- Fail-fast startup checks (e.g. `stripe.ts` throws immediately if `STRIPE_SECRET_KEY` is missing)
  turn a misconfigured deploy into an obvious boot failure instead of a silent 500 on the first
  customer's checkout.

**How this was verified**: there's no automated test suite yet (see
[Limitations](#honest-limitations--roadmap)) — the flows above were exercised manually against
Stripe's test-mode webhooks and CLI (`stripe trigger`, `stripe listen --forward-to`), including
deliberately replaying the same webhook event twice, killing the dev server mid-checkout to force
the reconciliation job to run, and firing overlapping return/cancel requests against the same order
to confirm the row locks actually prevent double refunds.

---

## The Admin Console

Everything under `/admin` is a separate route group with its **own root layout, its own stylesheet
and its own design system** — it doesn't inherit a single class from the storefront. That isolation
is deliberate: the shop is a marketing surface with serif display type and full-bleed imagery, while
the console is a dense operations tool. Sharing a theme between them would have meant compromising
both.

The layout is a fixed-height workspace on desktop — icon rail, top bar with search, section sidebar,
and a single scrolling work area — so navigation never scrolls away while you're three screens deep
in an order. On phones the whole thing collapses to a document scroll with a slide-in drawer.

### Access control

The "admin authorization is a stub" caveat from earlier versions of this project is gone. There are
now three independent layers:

1. **Better Auth's admin plugin** ([`src/lib/auth.ts`](src/lib/auth.ts),
   [`src/lib/permissions.ts`](src/lib/permissions.ts)) defines an access-control statement with two
   roles — `customer` (no admin statements at all) and `admin` (full user/session management) — plus
   ban support with a custom `bannedUserMessage`.
2. **`requireAdmin()`** ([`src/lib/admin/rbac.ts`](src/lib/admin/rbac.ts)) is the actual gate. It
   reads the session, then **re-reads `role`, `banned` and `banExpires` from the database** rather
   than trusting the session payload — so revoking someone's admin rights or banning them takes
   effect on their very next request instead of whenever their session happens to expire. It throws
   `UNAUTHORIZED`, `BANNED` or `FORBIDDEN` accordingly.
3. **Every admin page and every admin Server Action calls it first.** The layout redirect
   ([`src/app/(admin)/admin/layout.tsx`](src/app/(admin)/admin/layout.tsx)) is a UX convenience, not
   the security boundary — an action invoked directly, without ever rendering a page, still hits
   `requireAdmin()` on line one.

### Dashboard

The landing screen ([`src/app/(admin)/admin/page.tsx`](src/app/(admin)/admin/page.tsx)) answers one
question: *what needs a decision today?* Seven independent queries are fired in a single
`Promise.all`, and the layout is ordered by urgency rather than by what was easiest to compute.

| Block | Source | What it answers |
|---|---|---|
| Revenue headline | [`getDashboardStats`](src/lib/admin/queries/admin-queries/getDashboardStats.ts) | 30-day paid revenue, trend vs. the previous 30 days, today / 7-day / average-order breakdown |
| Attention tiles | same + [`getLowStock`](src/lib/admin/queries/admin-queries/getLowStock.ts) | orders waiting to be packed, open returns, sizes at or below one item — each links into the pre-filtered list |
| Revenue trend | [`getRevenueByDay`](src/lib/admin/queries/admin-queries/getRevenueByDay.ts) | 14-day curve with the period average marked |
| Fulfilment mix | [`getOrderMix`](src/lib/admin/queries/admin-queries/getOrderMix.ts) | where orders are actually stuck, by stage |
| Packing queue | [`getOrdersToFulfill`](src/lib/admin/queries/admin-queries/getOrdersToFulfill.ts) | oldest paid-but-unpacked orders first |
| Best sellers | [`getTopProducts`](src/lib/admin/queries/admin-queries/getTopProducts.ts) | units sold in paid orders over 30 days |
| Recent activity | [`getRecentActivity`](src/lib/admin/queries/admin-queries/getRecentActivity.ts) | last seven audited actions |

Two details worth pointing at:

- **`getRevenueByDay` gap-fills.** A `GROUP BY day` only returns days that had orders, so a quiet
  Tuesday would silently vanish and the chart would lie about the shape of the week. The query
  reconstructs the full N-day window and fills the holes with zeros before returning.
- **The charts are hand-written SVG**, not a library. A charting dependency would have added tens of
  kilobytes for one line and one ring, and none of them draw the diagonal hatch fill or the
  "decimals in a lighter colour" money treatment this design needed.
  [`TrendChart`](src/app/(admin)/admin/_components/charts/TrendChart.tsx) converts points to a
  Catmull-Rom spline, picks a round axis ceiling (`niceMax`), and animates itself in with
  `pathLength="1"` so the dash offset works without ever measuring the path.
  [`Donut`](src/app/(admin)/admin/_components/charts/Donut.tsx) is `stroke-dasharray` arithmetic on
  a single circle, each segment growing to its share via CSS custom properties.

### Orders workbench

The list ([`/admin/orders`](src/app/(admin)/admin/orders/page.tsx)) leads with **saved views** — All,
To pack, Unpaid, Shipped, Returned — because those five are what an operator actually opens, and
rebuilding them out of two dropdowns every morning is a waste of clicks. Payment and fulfilment
filters remain available underneath for everything else. All filter state lives in the URL, so a view
can be bookmarked or pasted into a chat.

The detail page shows the fulfilment timeline, item snapshots, the money breakdown, the last payment
attempt (including Stripe intent id and failure reason), the shipping address, and any linked return
requests.

Status changes go through [`changeFulfillmentStatus`](src/lib/admin/actions/orderStatus.ts), and the
rules live in exactly one place —
[`src/lib/admin/orders/transitions.ts`](src/lib/admin/orders/transitions.ts):

```ts
unfulfilled: ["processing", "cancelled"]
processing:  ["shipped", "cancelled"]
shipped:     ["delivered", "returned"]
delivered:   ["returned"]
cancelled:   []          // terminal
returned:    []          // terminal
```

The UI renders buttons from that map, and the action **re-validates against the same map after
row-locking the order** (`.for("update")`) — so the button set is a convenience, never the
enforcement. `processing`/`shipped`/`delivered` additionally require `paymentStatus === "paid"`, and
`cancelled`/`returned` restock every line inside the same transaction that writes the audit entry.

### Returns desk

The console mirrors the customer-side state machine described [above](#3-returns--refunds--a-real-state-machine-not-a-boolean),
but exposes the three steps as distinct operator actions
([`src/lib/admin/actions/return-actions/`](src/lib/admin/actions/return-actions/)):

1. **Approve or reject** each item individually (`decideReturnItem`).
2. **Take the item back into stock** (`restockReturnItem`) — a separate, explicit step, because
   approving a return and physically receiving the parcel are different events, sometimes days apart.
3. **Refund** the whole request (`refundReturn`).

The refund button is deliberately *not* just disabled when unavailable — the page computes the
blocking reason server-side, with the same rules the action will apply, and shows it as text:
*"Approve at least one item first"*, *"Take 2 items back to stock first"*, *"Already refunded:
€79.00"*. A greyed-out button with no explanation is one of the most common ways an operations tool
wastes someone's afternoon.

`refundReturn` itself re-checks everything (no existing `stripeRefundId`, approved items exist, all
of them restocked, a succeeded payment with a PaymentIntent exists, and the amount doesn't exceed
`payment.amount - payment.refundedAmount`), calls Stripe **outside** the transaction with an
idempotency key of `return_${requestId}`, and only then persists.

### Catalog

Products, categories, brands and collections share one section and one set of form primitives.

**Products.** The form is split into sections with a sticky storefront preview that updates as you
type — cover image, name, computed price, discount badge, total stock, size and image counts. Prices
are normalized server-side (comma → dot) and **the discount percentage is computed on the server**
from old price vs. price ([`validateAndNormalizeProduct`](src/lib/admin/validateAndNormalizeProduct.ts)),
never posted by the client. Sizes and images travel as JSON in hidden fields so the whole thing stays
one native `<form>` driven by `useActionState` — no client-side fetch layer, no optimistic-update
bookkeeping.

**Categories** are the fiddliest part of the catalog, because the tree is materialized with a `level`
column and a self-referencing `parentId`:

- [`resolveParent`](src/lib/admin/actions/categories-actions/helpers/resolveParent.ts) rejects a
  parent from a different gender branch, or one that would push the tree past three levels.
- Re-parenting a category **shifts the `level` of its entire subtree** in the same transaction — the
  descendants are collected with a recursive CTE
  ([`getDescendantIds`](src/lib/admin/queries/categories-operations/getDescendantIds.ts)), then
  updated by the delta.
- Deletion is blocked in application code when the category has children or products, even though
  the FK cascades. The cascade would work — it would also silently delete an entire branch of the
  storefront navigation because someone clicked the wrong row.
- Slugs get the gender prefix applied automatically (`women-knitwear`), and uniqueness is checked
  before the write so the user sees a field-level message instead of a raw constraint violation.

**Collections** are curated by hand, so the picker is a visual grid rather than a table. It computes
a diff against what was in the collection when the page loaded and states it plainly — `+3 to add`,
`−1 to remove` — before anything is written. Only active products matching the collection's own
audience are offered.

### Customers

The customer page pulls orders, cart and active sessions in one relational query, and derives
lifetime spend and average order value from the paid orders. The action panel
([`src/lib/admin/actions/users-actions/`](src/lib/admin/actions/users-actions/)) covers signing a user
out of every device, verifying an email by hand when the automated mail bounced, granting or revoking
admin rights, and banning with a reason and an optional expiry. Every one of those goes through
`withAudit`, so the reason for a ban is still retrievable months later.

### Audit log

Every mutating admin action calls [`logAudit`](src/lib/admin/audit.ts) **inside the same transaction
as the change itself** — if the write rolls back, so does its log entry, and there is no window in
which a change exists without a record of who made it.

Each entry stores actor id and email, the action, the entity type and id, `before`/`after` JSON
snapshots, plus IP and user agent pulled from the request headers. The log viewer
([`/admin/audit`](src/app/(admin)/admin/audit/page.tsx)) diffs the two snapshots and renders only the
fields that actually changed, old value struck through next to the new one — which is what turns
"someone updated a user" into "someone set `banned: false → true` with reason X on 1 Aug at 22:31
from 127.0.0.1".

### Media uploads

Images go to Supabase Storage through [`uploadProductImage`](src/lib/admin/actions/media.ts). The
`accept` attribute on the file input is treated as a hint, not a control: the action re-checks the
MIME type against an allowlist (JPEG/PNG/WebP/AVIF) and the 5 MB size cap on the server, because a
Server Action can be invoked directly. Filenames are UUIDs under a `year/` prefix so two people
uploading `photo.jpg` don't overwrite each other, and the service-role key that bypasses RLS lives
behind `server-only` in [`storage.ts`](src/lib/admin/storage.ts).

### Front-end architecture of the console

A few decisions that keep ~80 files of admin UI maintainable:

- **One column definition renders two layouts.**
  [`DataTable`](src/app/(admin)/admin/_components/ui/DataTable.tsx) takes a `Column[]` where each
  column declares its grid track, alignment, and its role on small screens (`title`, `trailing`,
  `meta`, `hide`). Above `lg` it renders grid rows — deliberately not a `<table>`, so a whole row can
  be a `<Link>` without nesting an anchor inside `<tr>`; below `lg` the same definition becomes cards
  with a title, a trailing value and a label/value grid. Six list pages share it.
- **Filters are plain GET forms.** Selects auto-submit, `page` is deliberately dropped so changing a
  filter resets pagination, and every list page stays a Server Component. On phones the submit button
  moves inside the search field so it can't detach and float off on its own line.
- **⌘K search** ([`CommandSearch`](src/app/(admin)/admin/_components/shell/CommandSearch.tsx)) makes
  no network calls: it jumps between pages and hands the query off to the right list's filter
  (`Orders: "maria@…"`, `Products: "wool"`). Predictable and instant beats clever here.
- **Skeletons mirror the real layout.** Every route has a `loading.tsx` backed by
  [`Skeleton.tsx`](src/app/(admin)/admin/_components/ui/Skeleton.tsx) with list, detail, form, tree
  and dashboard variants — same grid, same radii, same spacing — so nothing jumps when data arrives.
- **Motion lives in CSS, in one file.** [`admin.css`](src/app/(admin)/admin/admin.css) owns the
  keyframes and timings; components just attach a class. Page blocks cascade in on navigation, the
  revenue figure lifts into place, the trend line draws itself, donut segments grow to their share.
  All of it switches off under `prefers-reduced-motion`.
- **Operator copy is decoupled from server messages.**
  [`_lib/labels.ts`](src/app/(admin)/admin/_lib/labels.ts) holds the English dictionary the console
  renders; server-side validation strings stay next to the validation, so a copy tweak can't quietly
  change what an error means.

## Project Structure

```
src/
├── actions/              # Server Actions — storefront business logic, grouped by domain
│   ├── cart/               # guest/user cart, merge, quantity mutations
│   ├── checkout/           # stock reservation, Stripe session creation, webhook handlers
│   ├── returns/            # return request lifecycle, self-service cancellation
│   ├── search/             # pg_trgm/ILIKE hybrid search
│   ├── filters/            # brand/color/pattern/style/size/price/discount facets
│   └── products/, category/, collection/, favourites/, order/, profile/
├── app/
│   ├── (shop)/           # storefront — its own root layout, fonts and globals.css
│   │   ├── (main)/         # catalog, product, cart, favourites, per-gender routing
│   │   ├── (auth)/         # sign in / sign up
│   │   ├── account/        # orders, returns, profile (auth-gated)
│   │   ├── checkout/       # multi-step checkout + success page
│   │   └── api/            # Stripe webhook, QStash job endpoints, Better Auth handler
│   └── (admin)/admin/    # back-office console — its own root layout and admin.css
│       ├── _components/    # shell, ui primitives, charts, per-domain forms
│       ├── _lib/           # formatting, labels, query-string helpers
│       ├── products/, categories/, brands/, collections/
│       ├── orders/, returns/, users/, audit/
│       └── loading.tsx     # one per route — the skeletons
├── db/
│   ├── schema.ts         # Drizzle schema — single source of truth for the data model
│   └── seed-*.ts         # seeding scripts for demo catalog data
├── lib/
│   ├── admin/            # admin-only server code
│   │   ├── rbac.ts         # requireAdmin() — the authorization gate
│   │   ├── audit.ts        # transactional audit logging
│   │   ├── actions/        # mutations: products, categories, brands, collections, orders, returns, users
│   │   ├── queries/        # read models, including the dashboard aggregates
│   │   ├── validation/     # Zod schemas for admin forms
│   │   ├── orders/         # fulfilment transition rules
│   │   ├── returns/        # return state-machine rules
│   │   └── storage.ts      # Supabase Storage (service role, server-only)
│   ├── stripe/, qstash/, email/   # third-party integrations, all server-only
│   ├── size-mapping.ts             # multi-region size engine
│   ├── permissions.ts              # Better Auth access-control roles
│   └── auth.ts                     # Better Auth config + cart-merge hook
├── components/           # ~190 storefront components, organized by feature area
├── store/                # Zustand stores (UI/local state only — never server state)
├── hooks/                # data-fetching hooks (TanStack Query) + UI hooks
└── types/                # shared domain types
```

## Getting Started

```bash
npm install
cp .env.example .env   # fill in the variables below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin console lives at
[http://localhost:3000/admin](http://localhost:3000/admin) and needs a user whose `role` column is
`admin` — in development the quickest way in is to flip it directly:

```sql
update "user" set role = 'admin' where email = 'you@example.com';
```

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
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for the image bucket |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for admin image uploads — bypasses RLS, never exposed to the client |
| `APP_URL` | Base URL used for Stripe redirect URLs and QStash job callbacks |

Image uploads expect a public Supabase Storage bucket named `product-images`.

## Database Scripts

```bash
npm run seed:categories     # category tree (gender-scoped, nested)
npm run seed:brand-tags     # brands + tag metadata
npm run seed:products       # products with pricing/description
npm run seed:jeans          # denim catalog with waist/length sizing
npm run seed:images         # product image sets
npm run seed:collections    # curated collections
npm run seed:descs          # backfill product descriptions
npm run reset:products      # wipe the product catalog before a fresh seed
npm run debug               # ad-hoc query sandbox
```

Schema changes are managed with `drizzle-kit` (`drizzle.config.ts` → `src/db/schema.ts`); the schema
is the single source of truth and is pushed directly to the database during active development.

## Honest Limitations & Roadmap

In the interest of not overselling this: a few things are intentionally simplified for a portfolio
scope, and calling them out is more useful than pretending they don't exist.

- **No automated test suite yet.** The critical money paths (checkout, webhooks, refunds, returns)
  were verified manually with Stripe's test tooling as described [above](#10-security-posture), and
  the admin console was walked screen by screen at desktop and mobile widths. A Vitest suite around
  the transaction-heavy Server Actions, plus Playwright coverage of checkout, returns and the admin
  order/return flows, is the natural next step.
- **The console has no bulk operations.** Editing is one row at a time; a real merchandiser would
  want multi-select price changes and CSV import/export.
- **Dashboard windows are fixed** at 14 and 30 days. A date-range picker is more of a UI question
  than a data one — the queries already take a `days` argument.
- **Delivery and shipment tracking aren't modeled** beyond the `fulfillmentStatus` enum — no carrier
  integration, no tracking numbers.
- **Single currency (EUR)** end-to-end, even though the schema (`payment.currency`,
  `returnRequest.currency`) is already shaped to support more.
- **The console speaks English, server-side validation messages are still Russian.** They're
  deliberately separated (see [operator copy](#front-end-architecture-of-the-console)), so finishing
  the translation is a mechanical pass through `src/lib/admin/validation/` — it just hasn't been
  done yet.
