import type { SiteContent } from "@/lib/content/types";
import type { PublicSettings } from "@/lib/settings-defaults";

export interface PublicOffer {
  code: string;
  badge: string;
  title: string;
  text: string;
  subtext: string;
}

export interface FeaturedReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  product_name: string;
  product_slug: string;
}

export interface PublicReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  reply: string;
  date: string; // ISO
  product_name: string;
  product_slug: string;
  product_image: string;
}

/** Safe-to-publish site data sent to every visitor. */
export interface PublicSite {
  content: SiteContent;
  settings: PublicSettings;
  offers: PublicOffer[];
  featuredReviews: FeaturedReview[];
  publishedPages: string[];
  /** Current year (computed in the cached loader; used for the © line). */
  year: number;
}

/** wa.me link for the store's WhatsApp (or a contact picker if no number is set). */
export function whatsappUrl(number: string, text: string) {
  let digits = (number || "").replace(/\D/g, "");
  if (!digits) digits = "917617693687";
  else if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Hides links to policy pages that aren't published yet. */
export function isLinkLive(href: string, publishedPages: string[]) {
  const m = href.match(/^\/pages\/([\w-]+)/);
  return !m || publishedPages.includes(m[1]);
}

/** Splits a title around its highlighted words: [before, highlight, after]. */
export function splitHighlight(title: string, highlight: string): [string, string, string] {
  const i = highlight ? title.indexOf(highlight) : -1;
  if (i === -1) return [title, "", ""];
  return [title.slice(0, i), highlight, title.slice(i + highlight.length)];
}
