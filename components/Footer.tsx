"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/Header";
import { useSite, useWhatsApp } from "@/components/site/SiteProvider";
import { isLinkLive, type PublicSite } from "@/lib/site-types";

function FooterLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const external = /^https?:\/\//.test(href);
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  return (
    <Link href={href || "/"} className={className}>
      {children}
    </Link>
  );
}

function ContactBlock({ site, compact }: { site: PublicSite; compact?: boolean }) {
  const brand = site.content.brand;
  const whatsapp = useWhatsApp();
  const label = compact ? "text-[10px]" : "text-[10.5px] 2xl:text-xs";
  return (
    <div className={compact ? "space-y-3 pb-3.5 text-xs text-[#FAF6EE]/80" : "space-y-2.5 2xl:space-y-3 font-sans text-xs 2xl:text-[14px] text-[#FAF6EE]/80"}>
      <div>
        <p className={`${label} font-bold uppercase tracking-wider text-[#DFC99B]`}>Order &amp; Styling Support:</p>
        <a
          href={whatsapp()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-300 transition-all hover:bg-emerald-900/60 hover:text-white 2xl:text-[13px]"
        >
          <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-400" />
          <span>{brand.whatsapp_display ? `WhatsApp: ${brand.whatsapp_display}` : "Chat on WhatsApp"}</span>
        </a>
      </div>
      {brand.instagram_url && (
        <div>
          <p className={`${label} font-bold uppercase tracking-wider text-[#DFC99B]`}>Community &amp; Unboxings:</p>
          <a href={brand.instagram_url} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-block text-white transition-colors hover:text-[#DFC99B]">
            Instagram: <span className="font-medium text-[#DFC99B]">{brand.instagram_handle}</span>
          </a>
        </div>
      )}
      {(brand.email || brand.phone) && (
        <div>
          <p className={`${label} font-bold uppercase tracking-wider text-[#DFC99B]`}>Contact:</p>
          {brand.email && (
            <a href={`mailto:${brand.email}`} className="mt-0.5 block text-[#FAF6EE]/80 hover:text-[#DFC99B]">
              {brand.email}
            </a>
          )}
          {brand.phone && (
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="block text-[#FAF6EE]/80 hover:text-[#DFC99B]">
              {brand.phone}
            </a>
          )}
        </div>
      )}
      {(brand.address || site.content.footer.delivery_note) && (
        <div>
          <p className={`${label} font-bold uppercase tracking-wider text-[#DFC99B]`}>Atelier &amp; Fulfillment:</p>
          <p className="mt-0.5 leading-relaxed text-[#FAF6EE]/70">
            {[brand.address, site.content.footer.delivery_note].filter(Boolean).join(", ")}
          </p>
        </div>
      )}
      {brand.hours && (
        <div>
          <p className={`${label} font-bold uppercase tracking-wider text-[#DFC99B]`}>Support Hours:</p>
          <p className="mt-0.5 text-[#FAF6EE]/70">{brand.hours}</p>
        </div>
      )}
    </div>
  );
}

function SocialIcons({ size = "md" }: { size?: "sm" | "md" }) {
  const { brand } = useSite().content;
  const whatsapp = useWhatsApp();
  const box = size === "sm" ? "h-8 w-8" : "h-9 w-9 2xl:h-10 2xl:w-10";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const base = `flex ${box} items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all`;
  return (
    <>
      {brand.instagram_url && (
        <a href={brand.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`${base} text-[#FAF6EE] hover:border-[#8C671A] hover:bg-[#8C671A]`}>
          <InstagramIcon className={icon} />
        </a>
      )}
      {brand.facebook_url && (
        <a href={brand.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${base} text-[#FAF6EE] hover:border-[#8C671A] hover:bg-[#8C671A]`}>
          <FacebookIcon className={icon} />
        </a>
      )}
      <a href={whatsapp()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={`${base} text-emerald-400 hover:bg-emerald-600 hover:text-white`}>
        <WhatsAppIcon className={icon} />
      </a>
    </>
  );
}

export default function Footer() {
  const site = useSite();
  const { brand, footer } = site.content;
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggle = (id: string) => setOpenSection((prev) => (prev === id ? null : id));
  const legal = footer.legal_links.filter((l) => isLinkLive(l.href, site.publishedPages));
  const copyright = footer.copyright.replace("{year}", String(site.year));
  const columns = footer.columns.map((c) => ({ ...c, links: c.links.filter((l) => isLinkLive(l.href, site.publishedPages)) }));

  return (
    <footer id="footer" aria-label="Site Footer" className="border-t border-[#332A21] bg-[#1A1410] text-[#FAF6EE]">
      {/* ───────── Mobile accordion footer ───────── */}
      <div className="px-5 py-8 lg:hidden">
        <div className="flex items-center gap-3.5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#8C671A] bg-[#FAF6EE] shadow-md">
            <Image src={brand.logo} alt={`${brand.name} logo`} fill sizes="56px" className="object-cover" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold tracking-[0.14em] text-white">{brand.name}</h3>
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFC99B]">{brand.tagline}</p>
            {brand.status_badge && (
              <div className="mt-1 flex items-center gap-1.5 text-[10.5px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span>{brand.status_badge}</span>
              </div>
            )}
          </div>
        </div>

        {footer.about && <p className="mt-3 text-xs leading-relaxed text-[#FAF6EE]/75">{footer.about}</p>}

        {footer.badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {footer.badges.map((b) => (
              <span key={b} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-sans text-[10px] font-medium text-[#DFC99B]">
                ✦ {b}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2.5 border-b border-[#332A21] pb-5">
          <SocialIcons size="sm" />
          <span className="ml-1 text-[11px] text-[#FAF6EE]/60">Follow &amp; Chat with us</span>
        </div>

        {columns.map((col, i) => (
          <div key={i} className="border-b border-[#332A21]">
            <button
              type="button"
              onClick={() => toggle(`col-${i}`)}
              className="flex w-full items-center justify-between py-3.5 text-left font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC99B]"
              aria-expanded={openSection === `col-${i}`}
            >
              <span>{col.title}</span>
              <span className="text-base font-light">{openSection === `col-${i}` ? "−" : "+"}</span>
            </button>
            {openSection === `col-${i}` && (
              <ul className="space-y-2 pb-3.5 text-xs text-[#FAF6EE]/80">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <FooterLink href={l.href} className="block py-0.5 hover:text-[#DFC99B]">
                      {l.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="border-b border-[#332A21]">
          <button
            type="button"
            onClick={() => toggle("contact")}
            className="flex w-full items-center justify-between py-3.5 text-left font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC99B]"
            aria-expanded={openSection === "contact"}
          >
            <span>{footer.contact_title}</span>
            <span className="text-base font-light">{openSection === "contact" ? "−" : "+"}</span>
          </button>
          {openSection === "contact" && <ContactBlock site={site} compact />}
        </div>

        {footer.trust_strip.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-[10.5px]">
            {footer.trust_strip.map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <span className="text-[#8C671A]">✦</span>
                <span className="text-white/85">{t}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 space-y-2 border-t border-[#332A21] pt-4 text-center text-[10px] text-[#FAF6EE]/60">
          <p>{copyright}</p>
          {legal.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px]">
              {legal.map((l) => (
                <FooterLink key={l.href + l.label} href={l.href} className="hover:text-[#DFC99B]">
                  {l.label}
                </FooterLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ───────── Desktop footer ───────── */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-[1600px] px-10 py-12 xl:px-14 2xl:max-w-[1760px] 2xl:px-20 2xl:py-16">
          <div className="grid grid-cols-12 gap-8 2xl:gap-14">
            <div className="col-span-4 space-y-4 2xl:space-y-5">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-[#8C671A] bg-[#FAF6EE] shadow-lg shadow-black/50 2xl:h-24 2xl:w-24">
                  <Image src={brand.logo} alt={`${brand.name} logo`} fill sizes="96px" className="object-cover" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold tracking-[0.16em] text-white 2xl:text-3xl">{brand.name}</h3>
                  <p className="font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-[#DFC99B] 2xl:text-sm">{brand.tagline}</p>
                  {brand.status_badge && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      <span>{brand.status_badge}</span>
                    </div>
                  )}
                </div>
              </div>
              {footer.about && <p className="max-w-sm font-sans text-xs leading-relaxed text-[#FAF6EE]/75 2xl:max-w-md 2xl:text-[14px]">{footer.about}</p>}
              {footer.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-0.5 2xl:gap-2.5">
                  {footer.badges.map((b) => (
                    <span key={b} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-sans text-[10.5px] font-medium text-[#DFC99B] 2xl:px-3 2xl:py-1 2xl:text-xs">
                      ✦ {b}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2.5 pt-1 2xl:gap-3">
                <SocialIcons />
              </div>
            </div>

            {columns.map((col, i) => (
              <div key={i} className={`${columns.length > 2 ? "col-span-2" : i === 0 ? "col-span-2" : "col-span-3"} space-y-3 2xl:space-y-4`}>
                <h4 className="border-b border-[#332A21] pb-1.5 font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC99B] 2xl:text-sm">{col.title}</h4>
                <ul className="space-y-2 font-sans text-xs text-[#FAF6EE]/80 2xl:space-y-2.5 2xl:text-[14px]">
                  {col.links.map((l, j) => (
                    <li key={j}>
                      <FooterLink href={l.href} className="transition-colors hover:text-[#DFC99B]">
                        {l.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className={`${columns.length > 2 ? "col-span-2" : columns.length === 2 ? "col-span-3" : "col-span-4"} space-y-3 2xl:space-y-4`}>
              <h4 className="border-b border-[#332A21] pb-1.5 font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC99B] 2xl:text-sm">{footer.contact_title}</h4>
              <ContactBlock site={site} />
            </div>
          </div>
        </div>

        {footer.trust_strip.length > 0 && (
          <div className="border-y border-[#332A21] bg-[#140F0C] py-4 2xl:py-5">
            <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-10 text-xs text-[#DFC99B] xl:px-14 2xl:max-w-[1760px] 2xl:px-20 2xl:text-sm">
              {footer.trust_strip.map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-[#8C671A]">✦</span>
                  <span className="text-white/90">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[1600px] px-10 py-6 xl:px-14 2xl:max-w-[1760px] 2xl:px-20 2xl:py-7">
          <div className="flex items-center justify-between gap-3 text-[11.5px] text-[#FAF6EE]/60 2xl:text-xs">
            <p>{copyright}</p>
            {legal.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                {legal.map((l) => (
                  <FooterLink key={l.href + l.label} href={l.href} className="transition-colors hover:text-[#DFC99B]">
                    {l.label}
                  </FooterLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
