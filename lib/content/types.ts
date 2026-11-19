// Shapes of every admin-editable storefront content section.

export interface LinkItem {
  label: string;
  href: string;
}

export interface BrandContent {
  name: string;
  tagline: string;
  logo: string;
  status_badge: string;
  whatsapp_number: string; // digits incl. country code, e.g. 919876543210 (empty = WhatsApp picks the contact)
  whatsapp_display: string; // how the number is printed, e.g. +91 98765 43210
  whatsapp_default_message: string;
  instagram_url: string;
  instagram_handle: string;
  facebook_url: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export interface AnnouncementsContent {
  items: { text: string; icon: "sparkles" | "gift" | "truck" | "watch" }[];
}

export interface NavigationContent {
  dropdown_label: string;
  dropdown_heading: string;
  dropdown_items: { label: string; note: string; href: string }[];
  links: LinkItem[];
  mobile_links_heading: string;
  services_heading: string;
  services: { title: string; badge: string }[];
  whatsapp_cta: string;
  whatsapp_message: string;
}

export interface HeroSlideContent {
  desktop_image: string;
  mobile_image: string;
  image_alt: string;
  bg_color: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta_label: string;
  cta_href: string;
}

export interface HeroContent {
  autoplay_seconds: number;
  slides: HeroSlideContent[];
}

export interface HomeContent {
  categories_eyebrow: string;
  categories_title: string;
  categories_highlight: string;
  categories_text: string;

  bestsellers_eyebrow: string;
  bestsellers_title: string;
  bestsellers_highlight: string;
  bestsellers_text: string;
  bestsellers_whatsapp_label: string;
  bestsellers_whatsapp_message: string;

  proof_show: boolean;
  proof_eyebrow: string;
  proof_title: string;
  proof_highlight: string;
  proof_text: string;
  proof_cards: { title: string; text: string; tag: string; image: string }[];
  proof_help_title: string;
  proof_help_text: string;
  proof_cta_label: string;
  proof_cta_message: string;

  reviews_eyebrow: string;
  reviews_title: string;
  reviews_highlight: string;
  reviews_text: string;
  ticker_items: string[];
}

export interface GiftAddon {
  label: string;
  text: string;
  price: number;
  default_on: boolean;
  occasions: string[]; // occasion keys; empty = every occasion
}

export interface GiftingContent {
  show: boolean;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  spotlights: {
    eyebrow: string;
    title: string;
    highlight: string;
    image: string;
    perfect_for: string[];
    description: string;
    items: { title: string; text: string }[];
    cta_label: string;
    whatsapp_message: string;
    footnote: string;
  }[];
  customizer_show: boolean;
  customizer_eyebrow: string;
  customizer_title: string;
  customizer_text: string;
  gift_types: {
    key: string;
    label: string;
    subtitle: string;
    badge: string;
    base_price: number;
    image: string;
    features: string[];
    addons: GiftAddon[];
  }[];
  occasions: { key: string; label: string; tag: string; subtitle: string; theme_note: string }[];
  finale_perks: string[];
  estimate_spread: number;
  estimate_note: string;
  final_cta: string;
}

export interface ProductPageContent {
  promo_strip: string[];
  finish_options: { name: string; swatch: string; vibe: string }[];
  assurance_title: string;
  assurance_text: string;
  assurance_badge: string;
  in_stock_label: string;
  price_note: string;
  gift_wrap_label: string;
  gift_wrap_badge: string;
  delivery_days: number;
  pincode_message: string; // {date} and {pincode} are replaced
  trust_badges: string[];
  offers_title: string;
  offers_subtitle: string;
  info_badge: string;
  story_label: string;
  style_guide_title: string;
  style_guide: { title: string; text: string }[];
  highlights_title: string;
  highlights_badge: string;
  inside_box_title: string;
  inside_box_badge: string;
  inside_box: { title: string; text: string }[];
  spec_sheet_badge: string;
  extra_specs: { label: string; value: string }[];
  quality_meters: { label: string; value: string; badge: string }[];
  comparison_eyebrow: string;
  comparison_title: string;
  comparison_ours_label: string;
  comparison_others_label: string;
  comparison: { feature: string; ours: string; others: string }[];
  delivery_title: string;
  delivery_badge: string;
  delivery_steps: { step: string; title: string; text: string }[];
  policy_title: string;
  policy_rows: { label: string; value: string }[];
  care_dos_title: string;
  care_dos_subtitle: string;
  care_dos: string[];
  care_donts_title: string;
  care_donts_subtitle: string;
  care_donts: string[];
  care_disclaimer_title?: string;
  care_disclaimer_text?: string;
  featured_in_eyebrow: string;
  featured_in: string[];
  related_eyebrow: string;
  related_title: string;
}

export interface CartContentSection {
  drawer_promo: string;
  whatsapp_cta: string;
}

export interface FooterContent {
  about: string;
  badges: string[];
  columns: { title: string; links: LinkItem[] }[];
  contact_title: string;
  delivery_note: string;
  trust_strip: string[];
  legal_links: LinkItem[];
  copyright: string;
}

export interface SiteContent {
  brand: BrandContent;
  announcements: AnnouncementsContent;
  navigation: NavigationContent;
  hero: HeroContent;
  home: HomeContent;
  gifting: GiftingContent;
  product_page: ProductPageContent;
  cart: CartContentSection;
  footer: FooterContent;
}

export type ContentKey = keyof SiteContent;
