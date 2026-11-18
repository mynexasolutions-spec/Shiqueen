import Link from "next/link";
import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { getMyOrders } from "@/lib/server/account";
import { Card, EmptyState } from "@/components/admin/ui";
import OrderList from "@/components/account/OrderList";
import { buttonClass } from "@/components/ui/button-class";

export const metadata: Metadata = { title: "My orders" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function MyOrdersPage() {
  const orders = await getMyOrders();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-[34px] font-bold leading-tight sm:text-[40px]">My orders</h1>
      <Card padded={false}>
        {orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="No orders yet"
            body="Your orders will appear here once you check out."
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
