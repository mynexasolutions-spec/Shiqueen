import { Badge } from "@/components/admin/ui";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TONE,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_TONE,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/format";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={ORDER_STATUS_TONE[status]}>{ORDER_STATUS_LABEL[status]}</Badge>;
}

export function PaymentStatusBadge({ status, method }: { status: PaymentStatus; method?: "prepaid" | "cod" }) {
  return (
    <Badge tone={PAYMENT_STATUS_TONE[status]}>
      {PAYMENT_STATUS_LABEL[status]}
      {method ? ` · ${method === "cod" ? "COD" : "Prepaid"}` : ""}
    </Badge>
  );
}
