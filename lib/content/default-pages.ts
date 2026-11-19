// Starter information pages, seeded by `npm run db:seed`.
// Policy pages are seeded as DRAFTS: review the wording for your business, then publish in Admin → Pages.

export const DEFAULT_PAGES: { slug: string; title: string; body: string; published: boolean }[] = [
  {
    slug: "care-guide",
    title: "Jewellery Care Guide – SHIQUEEN",
    published: true,
    body: `Our pieces are crafted for everyday elegance, and proper care keeps them shining for a long time. Please note that artificial and anti-tarnish jewellery does not carry a polish warranty, as shine longevity depends on usage and care:

## For Anti-Tarnish Jewellery
- Designed to resist daily sweat and light splashes, but avoid prolonged exposure to water, swimming pools, soaps, and harsh chemicals.
- Always apply perfume, body mist, lotion, or hairspray before wearing your jewellery.
- Wipe gently with a soft, dry cloth after each use to remove sweat and oils.

## For Oxidised & Antique Jewellery
- Keep completely away from water, moisture, perfumes, and sweat.
- Store each piece separately in an airtight zip-lock pouch or dry box to prevent friction and natural oxidation.`,
  },
  {
    slug: "return-policy",
    title: "Return & Replacement Policy – SHIQUEEN",
    published: true,
    body: `At SHIQUEEN, every piece of jewellery and gift hamper is thoroughly inspected and packed with care before dispatch.

## Strict No-Exchange Policy
Due to hygiene standards and the delicate nature of fashion and demi-fine jewellery, we do not offer any exchanges or returns for change of mind, style preference, or colour variation due to screen lighting.

## When is a Return/Replacement Accepted?
We only accept return or replacement requests in the following two cases:

1. You received a physically damaged or broken product in transit.
2. You received a wrong product (different from the item you ordered on shiqueen.in).

## Mandatory Unboxing Video Proof
To claim a replacement or refund for a damaged or wrong item, you must record a continuous, unedited 360-degree parcel opening video clearly showing the sealed shipping label before opening and the issue inside. Claims without an unedited unboxing video will not be accepted.

## Reporting Window
Please share the unboxing video and order details on our WhatsApp support at +91 7617693687 within 24 hours of delivery.

## Non-Returnable Items & Conditions
- Customized gift hampers and personalized orders cannot be returned or cancelled once confirmed.
- Plating longevity depends on individual skin chemistry and usage; normal wear and tear, scratches, or fading after use are not eligible for return or refund.`,
  },
  {
    slug: "shipping-policy",
    title: "Shipping & Delivery Policy – SHIQUEEN",
    published: true,
    body: `We ship across 19,000+ pin codes in India with trusted logistics partners including Blue Dart and Delhivery.

## Dispatch & Processing
Orders are quality-checked, hand-packed in Shiqueen keepsake boxes, and dispatched within 24 hours on working days.

## Delivery Timelines
- **Metro Cities:** 1–3 working days (Express Air)
- **Rest of India:** 3–5 working days

## Live Tracking
Once your order is dispatched, you will receive live tracking links via WhatsApp and email. You can also track your order directly from **My Account → Orders**.

## Payment Modes & COD Availability
To guarantee fast-track, contactless, and safe transit, we currently accept **100% secure Prepaid orders** via UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and NetBanking.

**Cash on Delivery (COD) is currently unavailable.** All orders must be completed through secure online prepaid checkout to avoid delivery delays.`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    published: false,
    body: `This page explains what information we collect and how we use it.

## What we collect
- Your name, email, phone number and delivery address when you create an account or place an order
- Your order history

## How we use it
- To process and deliver your orders
- To send order updates and sign-in codes by email
- To answer your questions

We don't sell your personal information. Payment details are handled by our payment partners.

## Your choices
You can update your details from **My account**, or contact us to have your account removed.`,
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    published: false,
    body: `By using this website and placing an order, you agree to these terms.

## Orders and pricing
All prices are in Indian Rupees and include applicable taxes. We may cancel an order if an item is out of stock or a price was shown incorrectly; any payment made will be refunded.

## Accounts
You're responsible for keeping your sign-in details private.

## Contact
For any questions about these terms, contact us using the details in the footer.`,
  },
];
