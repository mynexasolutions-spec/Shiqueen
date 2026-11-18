"use client";

import { useState } from "react";

interface Day {
  day: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
}

const BAR = "#8C671A"; // brand gold — validated: lightness band, chroma, ≥3:1 vs white
const GRID = "#EFE8DD";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const compact = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `₹${n}`;
const dayLabel = (iso: string, long = false) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", long ? { weekday: "short", day: "numeric", month: "short" } : { day: "numeric", month: "short" });

function niceMax(v: number) {
  if (v <= 0) return 1000;
  const mag = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * mag >= v) ?? 10;
  return step * mag;
}

/** Single-series column chart: daily revenue, last 14 days. Hover/focus a column for details. */
export default function RevenueChart({ data }: { data: Day[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.revenue)));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  const H = 220;
  const total = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <figure>
      <figcaption className="sr-only">Daily revenue for the last 14 days, total {inr(total)}.</figcaption>
      <div className="flex gap-3">
        {/* Y axis */}
        <div className="relative w-14 shrink-0 text-right text-[14px] tabular-nums text-[#171717]/55" style={{ height: H }} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: H - (t / max) * H }}>
              {compact(t)}
            </span>
          ))}
        </div>

        {/* Plot */}
        <div className="relative min-w-0 flex-1" style={{ height: H }}>
          {ticks.map((t) => (
            <div key={t} className="absolute inset-x-0 h-px" style={{ top: H - (t / max) * H, background: GRID }} aria-hidden="true" />
          ))}
          <div className="absolute inset-0 flex items-end" onMouseLeave={() => setActive(null)}>
            {data.map((d, i) => {
              const h = d.revenue > 0 ? Math.max(3, (d.revenue / max) * H) : 0;
              const isActive = active === i;
              return (
                <button
                  key={d.day}
                  type="button"
                  className="group relative flex h-full flex-1 items-end justify-center focus:outline-none"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-label={`${dayLabel(d.day, true)}: ${inr(d.revenue)} from ${d.orders} order${d.orders === 1 ? "" : "s"}`}
                >
                  {isActive && <span className="absolute inset-y-0 left-1/2 w-full max-w-10 -translate-x-1/2 rounded-md bg-[#8C671A]/[0.07]" aria-hidden="true" />}
                  <span
                    className="relative w-[60%] max-w-6 rounded-t-[4px] transition-opacity group-focus-visible:ring-2 group-focus-visible:ring-[#171717] group-focus-visible:ring-offset-2"
                    style={{ height: h, background: BAR, opacity: active === null || isActive ? 1 : 0.55 }}
                  />
                </button>
              );
            })}
          </div>

          {/* Tooltip */}
          {active !== null && (
            <div
              role="status"
              className="pointer-events-none absolute z-10 w-max -translate-x-1/2 rounded-xl border border-[#E5DEC9] bg-white px-3.5 py-2.5 shadow-lg"
              style={{
                left: `clamp(70px, ${((active + 0.5) / data.length) * 100}%, calc(100% - 70px))`,
                top: Math.max(0, H - (data[active].revenue / max) * H - 78),
              }}
            >
              <p className="text-[14px] text-[#171717]/60">{dayLabel(data[active].day, true)}</p>
              <p className="text-lg font-semibold text-[#171717]">{inr(data[active].revenue)}</p>
              <p className="text-[14px] text-[#171717]/70">
                {data[active].orders} order{data[active].orders === 1 ? "" : "s"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* X axis — every 2nd day (every 4th on phones), anchored on today */}
      <div className="ml-[68px] mt-2 flex text-[14px] text-[#171717]/55" aria-hidden="true">
        {data.map((d, i) => {
          const fromEnd = data.length - 1 - i;
          return (
            <span key={d.day} className="relative flex-1">
              {fromEnd % 2 === 0 && (
                <span className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap ${fromEnd % 4 === 0 ? "" : "hidden sm:inline"}`}>
                  {dayLabel(d.day)}
                </span>
              )}
            </span>
          );
        })}
      </div>
      <div className="h-5" aria-hidden="true" />

      {/* Table view for screen readers */}
      <table className="sr-only">
        <caption>Daily revenue</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Revenue</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.day}>
              <td>{dayLabel(d.day, true)}</td>
              <td>{inr(d.revenue)}</td>
              <td>{d.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
