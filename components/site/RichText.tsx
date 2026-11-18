import { Fragment } from "react";

/**
 * Renders simple formatted text written in the admin:
 *   ## Heading      → section heading
 *   - item          → bullet list
 *   **bold**        → bold
 *   blank line      → new paragraph
 * Everything is rendered as React text — no raw HTML is ever injected.
 */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>
  );
}

export default function RichText({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-4 text-base leading-relaxed text-[#171717]/85 sm:text-[17px]">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim() !== "");
        if (lines.length === 0) return null;
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-6">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (lines[0].startsWith("## ")) {
          return (
            <Fragment key={i}>
              <h2 className="pt-4 font-serif text-2xl font-bold text-[#111111] sm:text-[28px]">{lines[0].slice(3)}</h2>
              {lines.length > 1 && <p>{inline(lines.slice(1).join(" "))}</p>}
            </Fragment>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
