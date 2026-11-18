import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatDate, type OrderStatus, type PaymentStatus } from "@/lib/format";

function historyLabel(status: string) {
  if (status.startsWith("payment:")) {
    const p = status.slice(8) as PaymentStatus;
    return `Payment: ${PAYMENT_STATUS_LABEL[p] ?? p}`;
  }
  return ORDER_STATUS_LABEL[status as OrderStatus] ?? status;
}

export default function OrderTimeline({
  history,
  showAuthor = false,
}: {
  history: { id: string; status: string; note: string; created_at: Date; by_name?: string | null }[];
  showAuthor?: boolean;
}) {
  return (
    <ol className="space-y-4">
      {history.map((h) => (
        <li key={h.id} className="flex gap-3">
          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#C59B27]" aria-hidden="true" />
          <div>
            <p className="text-base font-semibold">{historyLabel(h.status)}</p>
            {h.note && <p className="text-base text-[#171717]/75">{h.note}</p>}
            <p className="text-[15px] text-[#171717]/55">
              {formatDate(h.created_at, true)}
              {showAuthor && h.by_name ? ` · by ${h.by_name}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
