import { Fragment } from "react";

function inline(text: string) {
  // Split on **bold**, whatsapp phone numbers (+91 ...), and URLs
  const parts = text.split(/(\*\*[^*]+\*\*|\+91\s?\d{10}|shiqueen\.in|https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[#111111]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^\+91\s?\d{10}$/.test(part.trim())) {
      const num = part.replace(/\s+/g, "");
      return (
        <a
          key={i}
          href={`https://wa.me/${num.replace("+", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 transition"
        >
          {part}
        </a>
      );
    }
    if (part === "shiqueen.in") {
      return (
        <span key={i} className="font-medium text-[#8C671A]">
          shiqueen.in
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function ShieldAlertSvg() {
  return (
    <svg className="h-4 w-4 shrink-0 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function VideoCameraSvg() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#8C671A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function SparklesSvg() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#8C671A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  );
}

function CheckmarkSvg() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-[#8C671A] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface ParsedBlock {
  type: "heading" | "alert" | "video_notice" | "bullets" | "numbered" | "paragraph";
  headingText?: string;
  items?: string[];
  paragraphText?: string;
}

function parseBlocks(rawText: string): ParsedBlock[] {
  const normalized = rawText.replace(/\r\n/g, "\n");
  const rawParagraphs = normalized.split(/\n{2,}/);
  const result: ParsedBlock[] = [];

  for (const block of rawParagraphs) {
    const rawLines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (rawLines.length === 0) continue;

    let startIndex = 0;

    // Check if first line is a heading
    const headingMatch = rawLines[0].match(/^#{2,3}\s+(.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      const remainingLines = rawLines.slice(1);

      if (/no-exchange/i.test(heading)) {
        result.push({
          type: "alert",
          headingText: heading,
          paragraphText: remainingLines.join(" "),
        });
        continue;
      }

      if (/unboxing video/i.test(heading)) {
        result.push({
          type: "video_notice",
          headingText: heading,
          paragraphText: remainingLines.join(" "),
        });
        continue;
      }

      result.push({ type: "heading", headingText: heading });
      startIndex = 1;
    }

    const linesToProcess = rawLines.slice(startIndex);
    if (linesToProcess.length === 0) continue;

    // Group remaining lines by their item type (bullet, numbered, text)
    let currentType: "bullets" | "numbered" | "text" | null = null;
    let currentItems: string[] = [];

    const flush = () => {
      if (!currentType || currentItems.length === 0) return;
      if (currentType === "bullets") {
        result.push({ type: "bullets", items: [...currentItems] });
      } else if (currentType === "numbered") {
        result.push({ type: "numbered", items: [...currentItems] });
      } else {
        result.push({ type: "paragraph", paragraphText: currentItems.join(" ") });
      }
      currentItems = [];
      currentType = null;
    };

    for (const line of linesToProcess) {
      if (/^[-*]\s+/.test(line)) {
        if (currentType && currentType !== "bullets") flush();
        currentType = "bullets";
        currentItems.push(line.replace(/^[-*]\s+/, ""));
      } else if (/^\d+\.\s+/.test(line)) {
        if (currentType && currentType !== "numbered") flush();
        currentType = "numbered";
        currentItems.push(line.replace(/^\d+\.\s+/, ""));
      } else if (/^strict no-exchange policy/i.test(line)) {
        flush();
        const colonIdx = line.indexOf(":");
        result.push({
          type: "alert",
          headingText: "Strict No-Exchange Policy",
          paragraphText: colonIdx !== -1 ? line.slice(colonIdx + 1).trim() : line,
        });
      } else {
        if (currentType && currentType !== "text") flush();
        currentType = "text";
        currentItems.push(line);
      }
    }
    flush();
  }

  return result;
}

export default function RichText({ text }: { text: string }) {
  const blocks = parseBlocks(text);

  return (
    <div className="space-y-5 text-sm sm:text-[15.5px] leading-relaxed text-[#2C241D]/90 font-sans">
      {blocks.map((block, idx) => {
        if (block.type === "alert") {
          return (
            <div
              key={idx}
              className="my-5 rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/70 to-orange-50/30 p-4 sm:p-5 shadow-xs"
            >
              <div className="flex items-center gap-2 font-serif text-base sm:text-lg font-bold text-amber-950">
                <ShieldAlertSvg />
                <span>{block.headingText}</span>
              </div>
              {block.paragraphText && (
                <p className="mt-2 text-xs sm:text-[14px] leading-relaxed text-amber-900/90 font-sans">
                  {inline(block.paragraphText)}
                </p>
              )}
            </div>
          );
        }

        if (block.type === "video_notice") {
          return (
            <div
              key={idx}
              className="my-5 rounded-2xl border border-[#DFC99B] bg-[#FAF6EE] p-4 sm:p-5 shadow-xs"
            >
              <div className="flex items-center gap-2 font-serif text-base sm:text-lg font-bold text-[#8C671A]">
                <VideoCameraSvg />
                <span>{block.headingText}</span>
              </div>
              {block.paragraphText && (
                <p className="mt-2 text-xs sm:text-[14px] leading-relaxed text-[#2C241D]/90 font-sans">
                  {inline(block.paragraphText)}
                </p>
              )}
            </div>
          );
        }

        if (block.type === "heading") {
          return (
            <div key={idx} className="pt-4 pb-1">
              <h2 className="flex items-center gap-2 font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#1A1410] border-b border-[#E5DEC9]/60 pb-2">
                <SparklesSvg />
                <span>{block.headingText}</span>
              </h2>
            </div>
          );
        }

        if (block.type === "bullets" && block.items) {
          return (
            <ul key={idx} className="my-3 space-y-2.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-xs sm:text-[14.5px] leading-relaxed text-[#2C241D]/90">
                  <CheckmarkSvg />
                  <span>{inline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "numbered" && block.items) {
          return (
            <ol key={idx} className="my-3 space-y-2.5">
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-3 rounded-xl border border-[#E5DEC9]/70 bg-[#FAF7F2]/60 p-3 sm:p-3.5 text-xs sm:text-[14.5px] leading-relaxed text-[#2C241D]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8C671A] text-[10.5px] font-bold text-white shadow-xs">
                    {j + 1}
                  </span>
                  <span>{inline(item)}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "paragraph" && block.paragraphText) {
          return (
            <p key={idx} className="text-xs sm:text-[15px] leading-relaxed text-[#2C241D]/85">
              {inline(block.paragraphText)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}
