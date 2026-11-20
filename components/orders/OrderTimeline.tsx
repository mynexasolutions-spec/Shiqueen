import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, formatDate, type OrderStatus, type PaymentStatus } from "@/lib/format";

function historyLabel(status: string) {
  if (status.startsWith("payment:")) {
    const p = status.slice(8) as PaymentStatus;
    return `Payment: ${PAYMENT_STATUS_LABEL[p] ?? p}`;
  }
  return ORDER_STATUS_LABEL[status as OrderStatus] ?? status;
}

function parseNoteSource(note: string): { text: string; source: string | null } {
  const match = note.match(/\s*\[(webhook|checkout)\]\s*$/i);
  if (!match) return { text: note, source: null };
  return {
    text: note.slice(0, match.index).trim(),
    source: match[1].toLowerCase() === "webhook" ? "Webhook" : "Checkout",
  };
}

export default function OrderTimeline({
  history,
  showAuthor = false,
}: {
  history: { id: string; status: string; note: string; created_at: Date; by_name?: string | null }[];
  showAuthor?: boolean;
}) {
  return (
    <ol className="relative space-y-5">
      {history.map((h, idx) => {
        const isLast = idx === history.length - 1;
        const isLatest = idx === 0;
        const { text, source } = parseNoteSource(h.note);
        return (
          <li key={h.id} className="relative flex gap-3.5">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute left-[5px] top-4 bottom-[-24px] w-[2px] bg-[#EFE8DD]"
              />
            )}
            <span
              className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                isLatest ? "bg-[#C59B27] ring-4 ring-[#FBF0D5]" : "bg-[#D9CFB8]"
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-base font-semibold text-[#171717]">{historyLabel(h.status)}</p>
                {source && (
                  <span className="inline-flex items-center rounded-md border border-[#E5DEC9] bg-[#FAF7F2] px-2 py-0.5 text-xs font-semibold text-[#6F5114]">
                    {source}
                  </span>
                )}
              </div>
              {text && <p className="mt-0.5 break-words text-[15px] text-[#171717]/75">{text}</p>}
              <p className="mt-0.5 text-sm text-[#171717]/55">
                {formatDate(h.created_at, true)}
                {showAuthor && h.by_name ? ` · by ${h.by_name}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
