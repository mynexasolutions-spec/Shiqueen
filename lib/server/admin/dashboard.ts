import "server-only";
import { sql } from "../db";
import { requireAdmin } from "../session";
import { getSettings } from "../settings";

const VALID_ORDER = sql`not (payment_method = 'prepaid' and razorpay_order_id <> '' and payment_status in ('pending', 'failed'))`;
const COUNTED = sql`status not in ('cancelled', 'returned') and ${VALID_ORDER}`;

export async function getDashboardData() {
  await requireAdmin();
  const settings = await getSettings();

  const [kpi] = await sql<
    {
      revenue_30: number;
      revenue_prev_30: number;
      orders_30: number;
      orders_prev_30: number;
      pending: number;
      to_ship: number;
      customers: number;
      customers_30: number;
    }[]
  >`
    select
      (select coalesce(sum(total), 0)::int from orders where ${COUNTED} and created_at >= now() - interval '30 days') as revenue_30,
      (select coalesce(sum(total), 0)::int from orders where ${COUNTED} and created_at >= now() - interval '60 days' and created_at < now() - interval '30 days') as revenue_prev_30,
      (select count(*)::int from orders where ${VALID_ORDER} and created_at >= now() - interval '30 days') as orders_30,
      (select count(*)::int from orders where ${VALID_ORDER} and created_at >= now() - interval '60 days' and created_at < now() - interval '30 days') as orders_prev_30,
      (select count(*)::int from orders where ${VALID_ORDER} and status = 'pending') as pending,
      (select count(*)::int from orders where ${VALID_ORDER} and status in ('confirmed', 'processing')) as to_ship,
      (select count(*)::int from users where role = 'customer') as customers,
      (select count(*)::int from users where role = 'customer' and created_at >= now() - interval '30 days') as customers_30`;

  // Daily revenue for the last 14 days (India time), including zero days.
  const daily = await sql<{ day: string; revenue: number; orders: number }[]>`
    with days as (
      select generate_series((now() at time zone 'Asia/Kolkata')::date - 13, (now() at time zone 'Asia/Kolkata')::date, interval '1 day')::date as day
    )
    select to_char(d.day, 'YYYY-MM-DD') as day,
           coalesce(sum(o.total) filter (where o.status not in ('cancelled', 'returned')), 0)::int as revenue,
           count(o.id)::int as orders
    from days d
    left join orders o on (o.created_at at time zone 'Asia/Kolkata')::date = d.day
      and not (o.payment_method = 'prepaid' and o.razorpay_order_id <> '' and o.payment_status in ('pending', 'failed'))
    group by d.day order by d.day`;

  const recentOrders = await sql<
    { id: string; order_number: string; customer_name: string; total: number; status: string; created_at: Date }[]
  >`select id, order_number, customer_name, total, status, created_at from orders where ${VALID_ORDER} order by created_at desc limit 6`;

  const lowStock = await sql<{ id: string; name: string; stock: number }[]>`
    select id, name, stock from products
    where track_inventory and status = 'active' and stock <= ${settings.low_stock_threshold}
    order by stock asc, name limit 8`;

  const [catalog] = await sql<{ products: number; active: number; categories: number }[]>`
    select (select count(*)::int from products) as products,
           (select count(*)::int from products where status = 'active') as active,
           (select count(*)::int from categories) as categories`;

  return {
    kpi: { ...kpi },
    daily: daily.map((d) => ({ ...d })),
    recentOrders: recentOrders.map((o) => ({ ...o })),
    lowStock: lowStock.map((p) => ({ ...p })),
    catalog: { ...catalog },
  };
}
