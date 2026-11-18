// Starter information pages, seeded by `npm run db:seed`.
// Policy pages are seeded as DRAFTS: review the wording for your business, then publish in Admin → Pages.

export const DEFAULT_PAGES: { slug: string; title: string; body: string; published: boolean }[] = [
  {
    slug: "care-guide",
    title: "Care & Cleaning Guide",
    published: true,
    body: `Our anti-tarnish jewellery is made to be worn every day. A little care keeps the shine looking new for years.

## Do
- Wear it freely in the shower, at the gym and in the rain
- Apply perfume and lotions first, and let them dry before putting your jewellery on
- Wipe pieces gently with a soft microfiber cloth after wearing
- Store each piece in its pouch when travelling

## Don't
- Spray concentrated perfume directly onto the jewellery
- Keep pieces loose with keys, coins or other sharp metal
- Use harsh chemical dips or abrasive brushes
- Pull delicate chains forcefully when unclasping

Questions about caring for a piece? Message us on WhatsApp and we'll help.`,
  },
  {
    slug: "shipping-policy",
    title: "Shipping & Delivery Policy",
    published: false,
    body: `We ship across India.

## Dispatch
Orders are checked, packed and dispatched within 24 hours on working days.

## Delivery times
- Metro cities: 1–3 working days
- Rest of India: 3–5 working days

## Tracking
Once your order ships, you'll receive the courier name and tracking number by email, and you can follow it from **My account → My orders**.

## Shipping charges
Shipping charges, if any, are shown at checkout before you place your order.`,
  },
  {
    slug: "returns-and-exchanges",
    title: "Returns & Exchanges",
    published: false,
    body: `We want you to love your order.

## Exchanges
If your piece arrives damaged or isn't right, contact us within 3 days of delivery with your order number and photos, and we'll arrange an exchange.

## Conditions
- Items must be unused and in their original packaging
- Customised gifts, hampers and bouquets can't be exchanged unless they arrive damaged

## How to request
Message us on WhatsApp or email us with your order number.`,
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
