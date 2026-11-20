"use client";

import { useEffect, useState } from "react";

function greetingForHour(hour: number) {
  if (hour >= 5 && hour < 12) return { title: "Good morning", note: "A lovely day to grow your store." };
  if (hour >= 12 && hour < 17) return { title: "Good afternoon", note: "Your store is ready for whatever comes next." };
  if (hour >= 17 && hour < 22) return { title: "Good evening", note: "Take a moment to see how your store is doing." };
  return { title: "Still up?", note: "Your store is in good hands." };
}

function imageForHour(hour: number | null) {
  if (hour === null || (hour >= 5 && hour < 12)) return "/images/welcome-morning.png";
  if (hour < 17) return "/images/welcome-afternoon.png";
  if (hour < 22) return "/images/welcome-evening.png";
  return "/images/welcome-late-night.png";
}

export default function WelcomeBanner() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    updateClock();
    const timer = window.setInterval(updateClock, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = now
    ? Number(new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", hourCycle: "h23" }).format(now))
    : null;
  const greeting = hour === null ? { title: "Welcome back", note: "Your store is ready when you are." } : greetingForHour(hour);
  const bannerImage = imageForHour(hour);
  const clock = now
    ? `${new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now)} IST`
    : "--:--:-- -- IST";

  return (
    <section
      aria-label="Store welcome"
      className="mb-7 flex min-h-[164px] items-center overflow-hidden rounded-2xl border border-[#E8DCC5] bg-[#F1E2CF] px-6 py-5 shadow-[0_10px_28px_rgba(65,49,20,0.07)] sm:min-h-[188px] sm:px-9"
      style={{
        backgroundImage:
          `linear-gradient(90deg, rgba(250,246,238,0.97) 0%, rgba(250,246,238,0.91) 38%, rgba(250,246,238,0.20) 76%), url('${bannerImage}')`,
        backgroundSize: "100% 100%, auto 100%",
        backgroundPosition: "left center, right center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[62%] sm:max-w-[55%]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8C671A]">SHIQUEEN / ADMIN</p>
        <h2 className="mt-1 font-serif text-[28px] font-semibold leading-tight text-[#211F1B] sm:text-[38px]">{greeting.title}</h2>
        <p className="mt-1 text-sm text-[#514B41] sm:text-base">{greeting.note}</p>
        <p className="mt-3 font-mono text-sm font-semibold tabular-nums tracking-[0.08em] text-[#6F5114] sm:text-base" aria-label={`Current India time: ${clock}`}>
          {clock}
        </p>
      </div>
    </section>
  );
}
