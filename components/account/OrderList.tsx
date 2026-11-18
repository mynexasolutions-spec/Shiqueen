import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/StatusBadges";
import { formatDate, inr, type OrderStatus } from "@/lib/format";

export interface MyOrderRow {
  id: string;
  order_number: string;
  total: number;
  status: OrderStatus;
  created_at: Date;
  item_count: number;
  first_image: string | null;
}

export default function OrderList({ orders }: { orders: MyOrderRow[] }) {
  return (
    <ul className="divide-y divide-[#EFE8DD]">
      {orders.map((o) => (
        <li key={o.id}>
          <Link href={`/account/orders/${o.id}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#FDFBF7] sm:px-6">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E5DEC9] bg-[#FAF7F2]">
              {o.first_image ? (
                <Image src={o.first_image} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <Package className="m-auto h-full w-6 text-[#171717]/30" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-semibold">{o.order_number}</p>
              <p className="text-[15px] text-[#171717]/60">
                {formatDate(o.created_at)} · {o.item_count} item{o.item_count === 1 ? "" : "s"}
              </p>
              <div className="mt-1.5">
                <OrderStatusBadge status={o.status} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{inr(o.total)}</span>
              <ChevronRight className="h-5 w-5 text-[#171717]/40" aria-hidden="true" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
