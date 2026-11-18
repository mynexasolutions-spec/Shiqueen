"use client";

import { createContext, useContext, type ReactNode } from "react";
import { whatsappUrl, type PublicSite } from "@/lib/site-types";

const SiteContext = createContext<PublicSite | null>(null);

export function SiteProvider({ site, children }: { site: PublicSite; children: ReactNode }) {
  return <SiteContext value={site}>{children}</SiteContext>;
}

export function useSite(): PublicSite {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used within <SiteProvider>");
  return site;
}

/** Returns a function that builds a WhatsApp link to the store's number. */
export function useWhatsApp() {
  const { content } = useSite();
  return (text?: string) => whatsappUrl(content.brand.whatsapp_number, text || content.brand.whatsapp_default_message);
}
