import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderAdmin } from "@/lib/server/admin/orders";
import { getSettings } from "@/lib/server/settings";
import ReceiptView from "@/components/admin/ReceiptView";

export const metadata: Metadata = { title: "Order Receipt" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function OrderReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [order, settings] = await Promise.all([getOrderAdmin(id), getSettings()]);
  if (!order) notFound();

  return (
    <ReceiptView
      order={{
        ...order,
        created_at: order.created_at.toISOString(),
      }}
      store={{
        store_name: settings.store_name,
        support_email: settings.support_email,
        support_phone: settings.support_phone,
      }}
      autoPrint={sp.print === "1"}
    />
  );
}
