# SHIQUEEN — storefront + admin dashboard

Next.js 16 (Cache Components) · Supabase Postgres · ImageKit · Brevo.

## Setup

```bash
npm install
cp .env.example .env          # fill in the values
npm run db:migrate            # creates/updates tables (safe to re-run)
npm run db:seed               # loads the starter catalogue, coupons and settings
npm run dev
```

Create or reset an admin account (the password is never stored in the repo):

```bash
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='StrongPass123' npm run db:seed
```

## What's where

| Area | URL | Who |
| --- | --- | --- |
| Storefront | `/`, `/collections/[slug]`, `/products/[slug]`, `/checkout` | everyone |
| Sign in / sign up / reset | `/login`, `/signup`, `/forgot-password` | everyone |
| Customer dashboard | `/account` (orders, addresses, profile & password) | signed-in customers |
| Admin dashboard | `/admin` (orders, products, categories, customers, reviews, coupons & offers, storefront content, pages, settings) | admins only |
| Information pages | `/pages/[slug]` (shipping, returns, privacy…) | everyone (published pages only) |

### Managing the store (no code needed)

- **Storefront** (`/admin/storefront`): brand & contact (logo, WhatsApp number, socials), announcement bar, menu,
  homepage banner slides, homepage sections, gifting studio, product-page text & finishes, shopping bag, footer.
  Content lives in the `settings` table as `content.*` rows; defaults are in `lib/content/defaults.ts`.
- **Settings**: payment methods (online / COD on-off, labels, extra charges, discounts, COD limit, payment
  instructions), shipping, gift wrap, review rules.
- **Reviews**: customers write reviews when signed in; approve, hide, reply, or feature them on the homepage.
- **Coupons & offers**: tick “Show as offer” to display a coupon as an offer card on product pages.
- **Pages**: policy pages (seeded as drafts — review and publish). Footer links to drafts are hidden automatically.

- **Auth**: one login for everyone; the role decides where you land. New accounts verify their
  email with a 6-digit code. Sign in with password **or** a one-time email code. Sessions are
  random tokens in an httpOnly cookie, stored hashed in the `sessions` table.
- **Images**: admins upload through upload boxes; the browser sends files straight to ImageKit
  using a short-lived signature from `app/admin/_actions/upload.ts` (the private key never
  leaves the server).
- **Data**: all reads/writes happen on the server through `DATABASE_URL`. Every table has Row
  Level Security enabled with no policies, so Supabase's public API can't read them.
- **Prices**: checkout totals, coupons and stock are always recalculated on the server
  (`lib/server/pricing.ts`); the browser's numbers are display only.
- **Caching**: the storefront catalogue is cached (`lib/server/catalog.ts`) and refreshed
  instantly by admin changes via `refreshStorefront()`.

## Key folders

- `app/(auth)` — sign-in/up pages and auth Server Actions
- `app/admin` — admin pages; `app/admin/_actions` — admin Server Actions (each checks `requireAdmin()`)
- `app/account` — customer dashboard
- `lib/server` — database, sessions, OTP, email, ImageKit, catalogue and admin data access
- `db/schema.sql` — database schema; `scripts/` — migrate & seed
