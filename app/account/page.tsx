import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Package, ShoppingBag, UserRound } from "lucide-react";
import { requireUser } from "@/lib/server/session";
import { getMyAddresses, getMyOrders } from "@/lib/server/account";
import { Card, EmptyState } from "@/components/admin/ui";
import OrderList from "@/components/account/OrderList";
import { buttonClass } from "@/components/ui/button-class";

export const metadata: Metadata = { title: "My account" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function AccountOverview() {
  const [user, orders, addresses] = await Promise.all([requireUser(), getMyOrders(5), getMyAddresses()]);
  const active = orders.filter((o) => !["delivered", "cancelled", "returned"].includes(o.status)).length;
  const firstName = (user.name || "").split(" ")[0] || "Queen";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-[34px] font-bold leading-tight sm:text-[40px]">Hello, {firstName} ✨</h1>
        <p className="mt-1 text-[17px] text-[#171717]/70">Track your orders and manage your details.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/account/orders" className="rounded-2xl border border-[#E5DEC9] bg-white p-5 transition hover:border-[#C59B27]">
          <Package className="h-6 w-6 text-[#8C671A]" aria-hidden="true" />
          <p className="mt-3 text-[15px] text-[#171717]/65">Orders in progress</p>
          <p className="text-3xl font-semibold">{active}</p>
        </Link>
        <Link href="/account/addresses" className="rounded-2xl border border-[#E5DEC9] bg-white p-5 transition hover:border-[#C59B27]">
          <MapPin className="h-6 w-6 text-[#8C671A]" aria-hidden="true" />
          <p className="mt-3 text-[15px] text-[#171717]/65">Saved addresses</p>
          <p className="text-3xl font-semibold">{addresses.length}</p>
        </Link>
        <Link href="/account/profile" className="rounded-2xl border border-[#E5DEC9] bg-white p-5 transition hover:border-[#C59B27]">
          <UserRound className="h-6 w-6 text-[#8C671A]" aria-hidden="true" />
          <p className="mt-3 text-[15px] text-[#171717]/65">Signed in as</p>
          <p className="truncate text-lg font-semibold">{user.email}</p>
        </Link>
      </div>

      <Card
        title="Recent orders"
        padded={false}
        actions={
          orders.length > 0 && (
            <Link href="/account/orders" className="text-base font-semibold text-[#8C671A] hover:underline">
              View all
            </Link>
          )
        }
      >
        {orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="No orders yet"
            body="When you place an order it will show up here, with live status updates."
            action={
              <Link href="/" className={buttonClass("primary")}>
                Start shopping
              </Link>
            }
          />
        ) : (
          <OrderList orders={orders} />
        )}
      </Card>
    </div>
  );
}
