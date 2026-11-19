import type { ContentKey } from "./types";

// Describes how each content section is edited in Admin → Storefront.
// The same definitions drive the editor UI and server-side sanitising.

export type Field =
  | { key: string; label: string; type: "text"; hint?: string; max?: number; placeholder?: string }
  | { key: string; label: string; type: "textarea"; hint?: string; max?: number; rows?: number }
  | { key: string; label: string; type: "number"; hint?: string; min?: number; max?: number }
  | { key: string; label: string; type: "checkbox"; hint?: string }
  | { key: string; label: string; type: "color"; hint?: string }
  | { key: string; label: string; type: "image"; hint?: string; folder?: string; aspect?: string }
  | { key: string; label: string; type: "link"; hint?: string }
  | { key: string; label: string; type: "select"; hint?: string; options: { value: string; label: string }[] }
  | { key: string; label: string; type: "lines"; hint?: string; max?: number }
  | { key: string; label: string; type: "list"; hint?: string; itemLabel: string; titleKey?: string; fields: Field[]; maxItems?: number };

export interface Group {
  title: string;
  description?: string;
  fields: Field[];
}

export interface SectionDef {
  key: ContentKey;
  title: string;
  description: string;
  groups: Group[];
}

const linkList = (key: string, label: string, hint?: string): Field => ({
  key,
  label,
  type: "list",
  hint,
  itemLabel: "link",
  titleKey: "label",
  fields: [
    { key: "label", label: "Text", type: "text", max: 80 },
    { key: "href", label: "Link to", type: "link" },
  ],
});

const LINK_HINT = "Use /collections/slug, /products/slug, /pages/slug, /#section or a full https:// address.";

export const SECTIONS: SectionDef[] = [
  {
    key: "brand",
    title: "Brand & contact",
    description: "Logo, store name, WhatsApp number and social links used across the whole site.",
    groups: [
      {
        title: "Identity",
        fields: [
          { key: "name", label: "Store name", type: "text", max: 60 },
          { key: "tagline", label: "Tagline", type: "text", max: 80 },
          { key: "logo", label: "Logo", type: "image", folder: "/shiqueen/brand" },
          { key: "status_badge", label: "Status badge", type: "text", max: 60, hint: "Small green note next to the logo in the footer, e.g. “Pan-India Orders Open”." },
        ],
      },
      {
        title: "WhatsApp",
        fields: [
          { key: "whatsapp_number", label: "WhatsApp number (digits)", type: "text", max: 15, placeholder: "919876543210", hint: "Country code + number, digits only. Every “WhatsApp” button opens a chat with this number." },
          { key: "whatsapp_display", label: "Number as shown on the site", type: "text", max: 30, placeholder: "+91 98765 43210" },
          { key: "whatsapp_default_message", label: "Default chat message", type: "textarea", rows: 2, max: 300 },
        ],
      },
      {
        title: "Social & contact",
        fields: [
          { key: "instagram_url", label: "Instagram link", type: "link" },
          { key: "instagram_handle", label: "Instagram handle", type: "text", max: 60 },
          { key: "facebook_url", label: "Facebook link", type: "link" },
          { key: "email", label: "Contact email", type: "text", max: 120 },
          { key: "phone", label: "Contact phone", type: "text", max: 30 },
          { key: "address", label: "Studio / address", type: "textarea", rows: 2, max: 300 },
          { key: "hours", label: "Support hours", type: "text", max: 120 },
        ],
      },
    ],
  },
  {
    key: "announcements",
    title: "Announcement bar",
    description: "The scrolling messages at the very top of every page.",
    groups: [
      {
        title: "Messages",
        fields: [
          {
            key: "items",
            label: "Messages",
            type: "list",
            itemLabel: "message",
            titleKey: "text",
            maxItems: 12,
            fields: [
              { key: "text", label: "Message", type: "text", max: 200 },
              {
                key: "icon",
                label: "Icon",
                type: "select",
                options: [
                  { value: "sparkles", label: "Sparkle" },
                  { value: "gift", label: "Gift" },
                  { value: "truck", label: "Delivery truck" },
                  { value: "watch", label: "Watch" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "navigation",
    title: "Menu",
    description: "The main navigation menu and the mobile menu drawer.",
    groups: [
      {
        title: "Dropdown menu",
        fields: [
          { key: "dropdown_label", label: "Dropdown title", type: "text", max: 60 },
          { key: "dropdown_heading", label: "Small heading inside dropdown", type: "text", max: 80 },
          {
            key: "dropdown_items",
            label: "Dropdown links",
            type: "list",
            itemLabel: "link",
            titleKey: "label",
            hint: LINK_HINT,
            fields: [
              { key: "label", label: "Text", type: "text", max: 60 },
              { key: "note", label: "Short note", type: "text", max: 80 },
              { key: "href", label: "Link to", type: "link" },
            ],
          },
        ],
      },
      { title: "Top links", fields: [linkList("links", "Menu links", LINK_HINT)] },
      {
        title: "Mobile menu",
        fields: [
          { key: "mobile_links_heading", label: "Heading above the menu links", type: "text", max: 80 },
          { key: "services_heading", label: "Services heading", type: "text", max: 60 },
          {
            key: "services",
            label: "Services",
            type: "list",
            itemLabel: "service",
            titleKey: "title",
            fields: [
              { key: "title", label: "Title", type: "text", max: 120 },
              { key: "badge", label: "Subtitle", type: "text", max: 80 },
            ],
          },
          { key: "whatsapp_cta", label: "WhatsApp button text", type: "text", max: 60 },
          { key: "whatsapp_message", label: "WhatsApp message", type: "textarea", rows: 2, max: 300 },
        ],
      },
    ],
  },
  {
    key: "hero",
    title: "Homepage banner",
    description: "The large rotating banner (hero slides) at the top of the homepage.",
    groups: [
      {
        title: "Slides",
        fields: [
          { key: "autoplay_seconds", label: "Seconds per slide", type: "number", min: 2, max: 30 },
          {
            key: "slides",
            label: "Slides",
            type: "list",
            itemLabel: "slide",
            titleKey: "title",
            maxItems: 8,
            fields: [
              { key: "desktop_image", label: "Desktop image (wide, 16:9)", type: "image", folder: "/shiqueen/hero", aspect: "aspect-video" },
              { key: "mobile_image", label: "Mobile image (tall, 9:16)", type: "image", folder: "/shiqueen/hero", aspect: "aspect-[9/16]" },
              { key: "image_alt", label: "Image description (for accessibility)", type: "text", max: 300 },
              { key: "bg_color", label: "Background colour", type: "color", hint: "Match the left edge of the desktop image for a seamless blend." },
              { key: "eyebrow", label: "Small text above title", type: "text", max: 120 },
              { key: "title", label: "Title", type: "text", max: 120 },
              { key: "highlight", label: "Highlighted words in title", type: "text", max: 60, hint: "Must appear exactly in the title; shown in gold italics." },
              { key: "description", label: "Description", type: "textarea", rows: 3, max: 400 },
              { key: "cta_label", label: "Button text", type: "text", max: 60 },
              { key: "cta_href", label: "Button link", type: "link", hint: LINK_HINT },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "home",
    title: "Homepage sections",
    description: "Headings for the category grid, bestsellers, “why us” cards, reviews and the gold ticker.",
    groups: [
      {
        title: "Shop by category",
        fields: [
          { key: "categories_eyebrow", label: "Small heading", type: "text", max: 60 },
          { key: "categories_title", label: "Title", type: "text", max: 100 },
          { key: "categories_highlight", label: "Highlighted words", type: "text", max: 60 },
          { key: "categories_text", label: "Description", type: "textarea", rows: 2, max: 300 },
        ],
      },
      {
        title: "Bestsellers",
        description: "Products appear here when “Feature on homepage” is ticked on the product.",
        fields: [
          { key: "bestsellers_eyebrow", label: "Small heading", type: "text", max: 60 },
          { key: "bestsellers_title", label: "Title", type: "text", max: 100 },
          { key: "bestsellers_highlight", label: "Highlighted words", type: "text", max: 60 },
          { key: "bestsellers_text", label: "Description", type: "textarea", rows: 2, max: 300 },
          { key: "bestsellers_whatsapp_label", label: "WhatsApp button text", type: "text", max: 80 },
          { key: "bestsellers_whatsapp_message", label: "WhatsApp message", type: "textarea", rows: 2, max: 300 },
        ],
      },
      {
        title: "Why Shiqueen (photo cards)",
        fields: [
          { key: "proof_show", label: "Show this section", type: "checkbox" },
          { key: "proof_eyebrow", label: "Small heading", type: "text", max: 60 },
          { key: "proof_title", label: "Title", type: "text", max: 100 },
          { key: "proof_highlight", label: "Highlighted words", type: "text", max: 60 },
          { key: "proof_text", label: "Description", type: "textarea", rows: 2, max: 400 },
          {
            key: "proof_cards",
            label: "Cards",
            type: "list",
            itemLabel: "card",
            titleKey: "title",
            maxItems: 8,
            fields: [
              { key: "image", label: "Photo", type: "image", folder: "/shiqueen/home", aspect: "aspect-[3/4]" },
              { key: "title", label: "Title", type: "text", max: 100 },
              { key: "text", label: "Text", type: "textarea", rows: 2, max: 300 },
              { key: "tag", label: "Bottom tag", type: "text", max: 60 },
            ],
          },
          { key: "proof_help_title", label: "Help bar title", type: "text", max: 160 },
          { key: "proof_help_text", label: "Help bar text", type: "text", max: 200 },
          { key: "proof_cta_label", label: "Help bar button", type: "text", max: 60 },
          { key: "proof_cta_message", label: "Help bar WhatsApp message", type: "textarea", rows: 2, max: 300 },
        ],
      },
      {
        title: "Customer reviews",
        description: "Shows reviews you mark as “Featured” in Admin → Reviews. Hidden until you feature at least one.",
        fields: [
          { key: "reviews_eyebrow", label: "Small heading", type: "text", max: 60 },
          { key: "reviews_title", label: "Title", type: "text", max: 100 },
          { key: "reviews_highlight", label: "Highlighted words", type: "text", max: 60 },
          { key: "reviews_text", label: "Description", type: "text", max: 200 },
        ],
      },
      { title: "Gold ticker ribbon", fields: [{ key: "ticker_items", label: "Ticker messages", type: "lines", hint: "One per line." }] },
    ],
  },
  {
    key: "gifting",
    title: "Gifting studio",
    description: "The hampers & bouquets showcase and the step-by-step gift customizer on the homepage.",
    groups: [
      {
        title: "Section heading",
        fields: [
          { key: "show", label: "Show the gifting studio", type: "checkbox" },
          { key: "eyebrow", label: "Small heading", type: "text", max: 60 },
          { key: "title", label: "Title", type: "text", max: 120 },
          { key: "highlight", label: "Highlighted words", type: "text", max: 60 },
          { key: "description", label: "Description", type: "textarea", rows: 2, max: 400 },
        ],
      },
      {
        title: "Showcase cards",
        fields: [
          {
            key: "spotlights",
            label: "Showcase cards",
            type: "list",
            itemLabel: "card",
            titleKey: "title",
            maxItems: 4,
            fields: [
              { key: "image", label: "Photo", type: "image", folder: "/shiqueen/gifting", aspect: "aspect-[4/3]" },
              { key: "eyebrow", label: "Small heading", type: "text", max: 60 },
              { key: "title", label: "Title", type: "text", max: 120 },
              { key: "highlight", label: "Highlighted words", type: "text", max: 60 },
              { key: "perfect_for", label: "“Perfect for” tags", type: "lines", hint: "One per line." },
              { key: "description", label: "Description", type: "textarea", rows: 3, max: 500 },
              {
                key: "items",
                label: "What's inside",
                type: "list",
                itemLabel: "item",
                titleKey: "title",
                maxItems: 6,
                fields: [
                  { key: "title", label: "Title", type: "text", max: 60 },
                  { key: "text", label: "Text", type: "text", max: 80 },
                ],
              },
              { key: "cta_label", label: "Button text", type: "text", max: 60 },
              { key: "whatsapp_message", label: "WhatsApp message", type: "textarea", rows: 2, max: 300 },
              { key: "footnote", label: "Small note under button", type: "text", max: 160 },
            ],
          },
        ],
      },
      {
        title: "Gift customizer",
        fields: [
          { key: "customizer_show", label: "Show the customizer", type: "checkbox" },
          { key: "customizer_eyebrow", label: "Small heading", type: "text", max: 60 },
          { key: "customizer_title", label: "Title", type: "text", max: 120 },
          { key: "customizer_text", label: "Description", type: "textarea", rows: 2, max: 300 },
          {
            key: "occasions",
            label: "Occasions (step 2)",
            type: "list",
            itemLabel: "occasion",
            titleKey: "label",
            maxItems: 8,
            fields: [
              { key: "key", label: "Short code", type: "text", max: 30, hint: "Lowercase, no spaces (e.g. birthday). Used to link add-ons to occasions." },
              { key: "label", label: "Name", type: "text", max: 60 },
              { key: "tag", label: "Tag", type: "text", max: 40 },
              { key: "subtitle", label: "Description", type: "textarea", rows: 2, max: 200 },
              { key: "theme_note", label: "Theme note", type: "text", max: 120 },
            ],
          },
          {
            key: "gift_types",
            label: "Gift types (step 1) and their add-ons (step 3)",
            type: "list",
            itemLabel: "gift type",
            titleKey: "label",
            maxItems: 6,
            fields: [
              { key: "image", label: "Photo", type: "image", folder: "/shiqueen/gifting", aspect: "aspect-[4/3]" },
              { key: "key", label: "Short code", type: "text", max: 30, hint: "Lowercase, no spaces (e.g. hamper)." },
              { key: "label", label: "Name", type: "text", max: 60 },
              { key: "badge", label: "Badge", type: "text", max: 30 },
              { key: "subtitle", label: "Description", type: "textarea", rows: 2, max: 200 },
              { key: "base_price", label: "Starting price (₹)", type: "number", min: 0, max: 1000000 },
              { key: "features", label: "Highlights", type: "lines", hint: "One per line." },
              {
                key: "addons",
                label: "Add-ons",
                type: "list",
                itemLabel: "add-on",
                titleKey: "label",
                maxItems: 16,
                fields: [
                  { key: "label", label: "Name", type: "text", max: 80 },
                  { key: "text", label: "Description", type: "text", max: 120 },
                  { key: "price", label: "Extra price (₹, 0 = included)", type: "number", min: 0, max: 100000 },
                  { key: "default_on", label: "Ticked by default", type: "checkbox" },
                  { key: "occasions", label: "Only for occasions", type: "lines", hint: "Occasion short codes, one per line. Leave empty for every occasion." },
                ],
              },
            ],
          },
          { key: "finale_perks", label: "Perks on the final step", type: "lines", hint: "One per line." },
          { key: "estimate_spread", label: "Price range width (₹)", type: "number", min: 0, max: 100000, hint: "The estimate shows “total – total + this amount”." },
          { key: "estimate_note", label: "Note under the estimate", type: "text", max: 160 },
          { key: "final_cta", label: "Final WhatsApp button", type: "text", max: 60 },
        ],
      },
    ],
  },
  {
    key: "product_page",
    title: "Product page",
    description: "Text, finishes, policies and care guide shown on every product page.",
    groups: [
      {
        title: "Top of page",
        fields: [
          { key: "promo_strip", label: "Promo strip messages", type: "lines", hint: "One per line. Leave empty to hide the strip." },
          { key: "in_stock_label", label: "In-stock label", type: "text", max: 60 },
          { key: "price_note", label: "Note under price", type: "text", max: 160 },
          { key: "assurance_title", label: "Promise banner title", type: "text", max: 100 },
          { key: "assurance_text", label: "Promise banner text", type: "text", max: 200 },
          { key: "assurance_badge", label: "Promise banner badge", type: "text", max: 40 },
        ],
      },
      {
        title: "Finishes",
        description: "Choose which finishes each product offers on the product's edit page.",
        fields: [
          {
            key: "finish_options",
            label: "Finish options",
            type: "list",
            itemLabel: "finish",
            titleKey: "name",
            maxItems: 12,
            fields: [
              { key: "name", label: "Name", type: "text", max: 60 },
              { key: "swatch", label: "Swatch colour", type: "color", hint: "A colour, or a CSS gradient like linear-gradient(135deg,#E6C665,#B38728)." },
              { key: "vibe", label: "Description", type: "text", max: 160 },
            ],
          },
        ],
      },
      {
        title: "Buying box",
        fields: [
          { key: "gift_wrap_label", label: "Gift wrap label", type: "text", max: 80, hint: "The price comes from Settings → Gift wrap price." },
          { key: "gift_wrap_badge", label: "Gift wrap badge", type: "text", max: 40 },
          { key: "delivery_days", label: "Delivery estimate (days)", type: "number", min: 0, max: 30 },
          { key: "pincode_message", label: "Pincode check message", type: "text", max: 200, hint: "{date} and {pincode} are filled in automatically." },
          { key: "trust_badges", label: "Trust badges (4)", type: "lines", hint: "One per line." },
        ],
      },
      {
        title: "Offers",
        description: "Offer cards come from coupons with “Show as offer on product pages” ticked (Admin → Coupons).",
        fields: [
          { key: "offers_title", label: "Offers heading", type: "text", max: 100 },
          { key: "offers_subtitle", label: "Offers note", type: "text", max: 100 },
        ],
      },
      {
        title: "Description tab",
        fields: [
          { key: "info_badge", label: "Information badge", type: "text", max: 60 },
          { key: "story_label", label: "Story label", type: "text", max: 60 },
          { key: "style_guide_title", label: "Style guide heading", type: "text", max: 100 },
          {
            key: "style_guide",
            label: "Style guide cards",
            type: "list",
            itemLabel: "card",
            titleKey: "title",
            maxItems: 6,
            fields: [
              { key: "title", label: "Title", type: "text", max: 40 },
              { key: "text", label: "Text", type: "text", max: 160 },
            ],
          },
          { key: "highlights_title", label: "Highlights heading", type: "text", max: 80 },
          { key: "highlights_badge", label: "Highlights badge", type: "text", max: 40 },
          { key: "inside_box_title", label: "“Inside the package” heading", type: "text", max: 80 },
          { key: "inside_box_badge", label: "“Inside the package” badge", type: "text", max: 60 },
          {
            key: "inside_box",
            label: "Package contents",
            type: "list",
            itemLabel: "item",
            titleKey: "title",
            maxItems: 8,
            fields: [
              { key: "title", label: "Title", type: "text", max: 60 },
              { key: "text", label: "Text", type: "text", max: 120 },
            ],
          },
        ],
      },
      {
        title: "Specifications tab",
        fields: [
          { key: "spec_sheet_badge", label: "Spec sheet badge", type: "text", max: 60 },
          {
            key: "extra_specs",
            label: "Specs added to every product",
            type: "list",
            itemLabel: "spec",
            titleKey: "label",
            fields: [
              { key: "label", label: "Label", type: "text", max: 60 },
              { key: "value", label: "Value", type: "text", max: 200 },
            ],
          },
          {
            key: "quality_meters",
            label: "Quality cards",
            type: "list",
            itemLabel: "card",
            titleKey: "label",
            maxItems: 4,
            fields: [
              { key: "label", label: "Label", type: "text", max: 60 },
              { key: "value", label: "Value", type: "text", max: 120 },
              { key: "badge", label: "Badge", type: "text", max: 30 },
            ],
          },
          { key: "comparison_eyebrow", label: "Comparison small heading", type: "text", max: 60 },
          { key: "comparison_title", label: "Comparison title", type: "text", max: 100 },
          { key: "comparison_ours_label", label: "“Ours” column", type: "text", max: 40 },
          { key: "comparison_others_label", label: "“Others” column", type: "text", max: 40 },
          {
            key: "comparison",
            label: "Comparison rows",
            type: "list",
            itemLabel: "row",
            titleKey: "feature",
            maxItems: 10,
            fields: [
              { key: "feature", label: "Quality factor", type: "text", max: 60 },
              { key: "ours", label: "Ours", type: "text", max: 60 },
              { key: "others", label: "Others", type: "text", max: 60 },
            ],
          },
        ],
      },
      {
        title: "Shipping & care tab",
        fields: [
          { key: "delivery_title", label: "Delivery heading", type: "text", max: 100 },
          { key: "delivery_badge", label: "Delivery badge", type: "text", max: 80 },
          {
            key: "delivery_steps",
            label: "Delivery steps",
            type: "list",
            itemLabel: "step",
            titleKey: "title",
            maxItems: 5,
            fields: [
              { key: "step", label: "Step label", type: "text", max: 60 },
              { key: "title", label: "Title", type: "text", max: 80 },
              { key: "text", label: "Text", type: "text", max: 200 },
            ],
          },
          { key: "policy_title", label: "Policy table heading", type: "text", max: 80 },
          {
            key: "policy_rows",
            label: "Policy rows",
            type: "list",
            itemLabel: "row",
            titleKey: "label",
            maxItems: 10,
            fields: [
              { key: "label", label: "Label", type: "text", max: 60 },
              { key: "value", label: "Value", type: "text", max: 160 },
            ],
          },
          { key: "care_dos_title", label: "Do's heading", type: "text", max: 60 },
          { key: "care_dos_subtitle", label: "Do's subheading", type: "text", max: 100 },
          { key: "care_dos", label: "Do's", type: "lines", hint: "One per line." },
          { key: "care_donts_title", label: "Don'ts heading", type: "text", max: 60 },
          { key: "care_donts_subtitle", label: "Don'ts subheading", type: "text", max: 100 },
          { key: "care_donts", label: "Don'ts", type: "lines", hint: "One per line." },
          { key: "care_disclaimer_title", label: "Care disclaimer title", type: "text", max: 80 },
          { key: "care_disclaimer_text", label: "Care disclaimer note", type: "textarea", rows: 3, max: 500 },
        ],
      },
      {
        title: "Lower sections",
        fields: [
          { key: "featured_in_eyebrow", label: "“Featured in” small heading", type: "text", max: 100 },
          { key: "featured_in", label: "“Featured in” publications", type: "lines", hint: "One per line. Leave empty to hide the section." },
          { key: "related_eyebrow", label: "Related products small heading", type: "text", max: 60 },
          { key: "related_title", label: "Related products title", type: "text", max: 60 },
        ],
      },
    ],
  },
  {
    key: "cart",
    title: "Shopping bag",
    description: "Text inside the slide-out shopping bag.",
    groups: [
      {
        title: "Bag drawer",
        fields: [
          { key: "drawer_promo", label: "Promo line at the top", type: "text", max: 120 },
          { key: "whatsapp_cta", label: "WhatsApp order button", type: "text", max: 60 },
        ],
      },
    ],
  },
  {
    key: "footer",
    title: "Footer",
    description: "Footer text, link columns, trust strip and legal links.",
    groups: [
      {
        title: "About",
        fields: [
          { key: "about", label: "About text", type: "textarea", rows: 3, max: 600 },
          { key: "badges", label: "Small badges", type: "lines", hint: "One per line." },
        ],
      },
      {
        title: "Link columns",
        fields: [
          {
            key: "columns",
            label: "Columns",
            type: "list",
            itemLabel: "column",
            titleKey: "title",
            maxItems: 4,
            fields: [
              { key: "title", label: "Column title", type: "text", max: 60 },
              linkList("links", "Links", LINK_HINT),
            ],
          },
        ],
      },
      {
        title: "Contact & bottom",
        description: "Contact details come from Brand & contact.",
        fields: [
          { key: "contact_title", label: "Contact column title", type: "text", max: 60 },
          { key: "delivery_note", label: "Delivery note", type: "text", max: 200 },
          { key: "trust_strip", label: "Trust strip", type: "lines", hint: "One per line." },
          linkList("legal_links", "Legal links", "Links to unpublished pages are hidden automatically."),
          { key: "copyright", label: "Copyright line", type: "text", max: 200, hint: "{year} is replaced with the current year." },
        ],
      },
    ],
  },
];

export const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s])) as Record<ContentKey, SectionDef>;
