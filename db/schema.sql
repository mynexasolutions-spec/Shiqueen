-- SHIQUEEN e-commerce schema (Supabase Postgres)
-- Idempotent: safe to run multiple times (`npm run db:migrate`).
--
-- Security note: every table has Row Level Security ENABLED with NO policies.
-- That blocks Supabase's public Data API (anon / authenticated keys) from reading
-- or writing anything. The Next.js server connects as the table owner through
-- DATABASE_URL, which bypasses RLS, so all access goes through server code.

create extension if not exists citext;

-- ───────────────────────── Users & auth ─────────────────────────
create table if not exists users (
  id                  uuid primary key default gen_random_uuid(),
  email               citext not null unique,
  password_hash       text,
  name                text not null default '',
  phone               text not null default '',
  role                text not null default 'customer' check (role in ('customer', 'admin')),
  email_verified_at   timestamptz,
  is_active           boolean not null default true,
  failed_login_count  integer not null default 0,
  locked_until        timestamptz,
  last_login_at       timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  token_hash  text not null unique,
  expires_at  timestamptz not null,
  ip          text,
  user_agent  text,
  created_at  timestamptz not null default now()
);
create index if not exists sessions_user_idx on sessions(user_id);

create table if not exists email_otps (
  id           uuid primary key default gen_random_uuid(),
  email        citext not null,
  purpose      text not null check (purpose in ('verify', 'login', 'reset')),
  code_hash    text not null,
  attempts     integer not null default 0,
  expires_at   timestamptz not null,
  consumed_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists email_otps_lookup_idx on email_otps(email, purpose, created_at desc);

create table if not exists addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  full_name   text not null,
  phone       text not null,
  line1       text not null,
  line2       text not null default '',
  city        text not null,
  state       text not null,
  pincode     text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists addresses_user_idx on addresses(user_id);

-- ───────────────────────── Catalog ─────────────────────────
create table if not exists categories (
  id             uuid primary key default gen_random_uuid(),
  parent_id      uuid references categories(id) on delete restrict,
  name           text not null,
  slug           text not null unique,
  tagline        text not null default '',
  description    text not null default '',
  badge          text not null default '',
  image_url      text not null default '',
  image_file_id  text not null default '',
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  show_on_home   boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint categories_not_self_parent check (parent_id is null or parent_id <> id)
);
create index if not exists categories_parent_idx on categories(parent_id);

create table if not exists products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  category_id       uuid references categories(id) on delete set null,
  description       text not null default '',
  price             integer not null check (price >= 0),           -- rupees
  compare_at_price  integer not null default 0 check (compare_at_price >= 0),
  sku               text not null default '',
  stock             integer not null default 0,
  track_inventory   boolean not null default true,
  status            text not null default 'active' check (status in ('active', 'draft', 'archived')),
  is_featured       boolean not null default false,
  badge             text not null default '',
  plating           text not null default '18K Gold Plated',
  material          text not null default '',
  features          text[] not null default '{}',
  specifications    jsonb not null default '[]'::jsonb,
  rating            numeric(2,1) not null default 5.0 check (rating >= 0 and rating <= 5),
  review_count      integer not null default 0,
  seo_title         text not null default '',
  seo_description   text not null default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists products_category_idx on products(category_id);
create index if not exists products_status_idx on products(status);

create table if not exists product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  file_id     text not null default '',
  alt         text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists product_images_product_idx on product_images(product_id, sort_order);

-- ───────────────────────── Commerce ─────────────────────────
create table if not exists coupons (
  id            uuid primary key default gen_random_uuid(),
  code          citext not null unique,
  description   text not null default '',
  type          text not null check (type in ('percent', 'fixed')),
  value         integer not null check (value > 0),
  min_subtotal  integer not null default 0,
  min_items     integer not null default 0,
  max_discount  integer,
  usage_limit   integer,
  used_count    integer not null default 0,
  starts_at     timestamptz,
  ends_at       timestamptz,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create sequence if not exists order_number_seq start 100001;

create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  order_number      text not null unique default ('SQ-' || nextval('order_number_seq')::text),
  user_id           uuid references users(id) on delete set null,
  customer_name     text not null,
  email             citext not null default '',
  phone             text not null,
  shipping_address  jsonb not null,
  mrp_total         integer not null default 0,
  subtotal          integer not null,
  gift_wrap_total   integer not null default 0,
  prepaid_discount  integer not null default 0,
  coupon_code       text not null default '',
  coupon_discount   integer not null default 0,
  shipping_fee      integer not null default 0,
  total             integer not null,
  payment_method    text not null check (payment_method in ('prepaid', 'cod')),
  payment_status    text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  status            text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  courier           text not null default '',
  tracking_number   text not null default '',
  tracking_url      text not null default '',
  customer_notes    text not null default '',
  admin_notes       text not null default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists orders_user_idx on orders(user_id);
create index if not exists orders_email_idx on orders(email);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_idx on orders(created_at desc);

create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  product_name  text not null,
  product_slug  text not null default '',
  image_url     text not null default '',
  finish        text not null default '',
  unit_price    integer not null,
  unit_mrp      integer not null default 0,
  quantity      integer not null check (quantity > 0),
  gift_wrap     boolean not null default false,
  gift_message  text not null default '',
  line_total    integer not null
);
create index if not exists order_items_order_idx on order_items(order_id);

create table if not exists order_status_history (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  status      text not null,
  note        text not null default '',
  created_by  uuid references users(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists order_status_history_order_idx on order_status_history(order_id, created_at);

create table if not exists settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ───────────────────────── Lock down the public Data API ─────────────────────────
alter table users                 enable row level security;
alter table sessions              enable row level security;
alter table email_otps            enable row level security;
alter table addresses             enable row level security;
alter table categories            enable row level security;
alter table products              enable row level security;
alter table product_images        enable row level security;
alter table coupons               enable row level security;
alter table orders                enable row level security;
alter table order_items           enable row level security;
alter table order_status_history  enable row level security;
alter table settings              enable row level security;

-- ───────────────────────── v2: reviews, offers, payments, CMS ─────────────────────────
create table if not exists reviews (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references products(id) on delete cascade,
  user_id            uuid references users(id) on delete set null,
  author_name        text not null,
  location           text not null default '',
  rating             integer not null check (rating between 1 and 5),
  title              text not null default '',
  body               text not null,
  status             text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  is_featured        boolean not null default false,
  verified_purchase  boolean not null default false,
  admin_reply        text not null default '',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create unique index if not exists reviews_one_per_user_idx on reviews(product_id, user_id) where user_id is not null;
create index if not exists reviews_product_idx on reviews(product_id, status);
create index if not exists reviews_status_idx on reviews(status, created_at desc);
alter table reviews enable row level security;

create table if not exists pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  body          text not null default '',
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
alter table pages enable row level security;

-- Coupons can be shown as offer cards on product pages.
alter table coupons add column if not exists show_as_offer boolean not null default false;
alter table coupons add column if not exists offer_badge   text not null default '';
alter table coupons add column if not exists offer_title   text not null default '';
alter table coupons add column if not exists offer_text    text not null default '';
alter table coupons add column if not exists offer_subtext text not null default '';
alter table coupons add column if not exists offer_order   integer not null default 0;

-- Finishes a product is offered in (empty = only its main plating).
alter table products add column if not exists finishes text[] not null default '{}';
-- Ratings now come from real customer reviews.
alter table products drop column if exists rating;
alter table products drop column if exists review_count;

-- Extra charge for the chosen payment method (e.g. a COD fee).
alter table orders add column if not exists payment_fee integer not null default 0;

-- Razorpay payment tracking on orders.
alter table orders add column if not exists razorpay_order_id   text not null default '';
alter table orders add column if not exists razorpay_payment_id text not null default '';
create index if not exists orders_razorpay_order_idx on orders(razorpay_order_id) where razorpay_order_id <> '';
