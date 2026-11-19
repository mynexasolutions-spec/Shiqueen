import "server-only";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

interface SendEmailInput {
  to: { email: string; name?: string };
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[email] BREVO_API_KEY is not configured");
    return false;
  }
  try {
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL ?? "noreply@shiqueen.in",
          name: process.env.BREVO_SENDER_NAME ?? "ShiQueen",
        },
        to: [to],
        subject,
        htmlContent: html,
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      console.error("[email] Brevo error", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#FAF7F2;font-family:Arial,Helvetica,sans-serif;color:#171717">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #E5DEC9;border-radius:16px">
        <tr><td style="padding:28px 32px 8px;text-align:center">
          <div style="font-family:Georgia,serif;font-size:28px;letter-spacing:4px;font-weight:bold;color:#8C671A">SHIQUEEN</div>
          <div style="font-size:12px;letter-spacing:2px;color:#8C671A;margin-top:4px">CRAFTED FOR EVERY QUEEN</div>
        </td></tr>
        <tr><td style="padding:16px 32px 32px;font-size:16px;line-height:1.6">
          <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 12px">${escapeHtml(title)}</h1>
          ${body}
        </td></tr>
      </table>
      <p style="font-size:12px;color:#777;margin-top:16px">You received this email because of activity on your Shiqueen account.</p>
    </td></tr>
  </table></body></html>`;
}

const OTP_COPY = {
  verify: { subject: "Verify your Shiqueen account", title: "Verify your email", intro: "Welcome to Shiqueen! Use this code to verify your email address:" },
  login: { subject: "Your Shiqueen sign-in code", title: "Your sign-in code", intro: "Use this code to sign in to your Shiqueen account:" },
  reset: { subject: "Reset your Shiqueen password", title: "Reset your password", intro: "Use this code to reset your Shiqueen password:" },
} as const;

export function sendOtpEmail(email: string, code: string, purpose: keyof typeof OTP_COPY) {
  const copy = OTP_COPY[purpose];
  const html = layout(
    copy.title,
    `<p>${copy.intro}</p>
     <div style="font-size:34px;font-weight:bold;letter-spacing:10px;text-align:center;background:#FAF7F2;border:1px dashed #C59B27;border-radius:12px;padding:16px;margin:20px 0">${code}</div>
     <p>This code expires in 10 minutes. If you didn't request it, you can safely ignore this email.</p>`
  );
  return sendEmail({ to: { email }, subject: copy.subject, html });
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  email: string;
  total: number;
  paymentMethod: string;
  paymentLabel?: string;
  instructions?: string;
  items: { name: string; quantity: number; lineTotal: number; finish: string }[];
  address: string;
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function orderTable(o: OrderEmailData) {
  const rows = o.items
    .map(
      (i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${escapeHtml(i.name)}<br><span style="color:#777;font-size:14px">${escapeHtml(i.finish)} × ${i.quantity}</span></td>
              <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${inr(i.lineTotal)}</td></tr>`
    )
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:16px;margin:16px 0">${rows}
    <tr><td style="padding-top:12px;font-weight:bold">Total</td><td style="padding-top:12px;text-align:right;font-weight:bold">${inr(o.total)}</td></tr></table>`;
}

export function sendOrderConfirmationEmail(o: OrderEmailData) {
  if (!o.email) return Promise.resolve(false);
  const html = layout(
    `Thank you, ${o.customerName.split(" ")[0] || "Queen"}!`,
    `<p>We've received your order <strong>${escapeHtml(o.orderNumber)}</strong>. Our team will confirm it shortly.</p>
     ${orderTable(o)}
     ${o.instructions ? `<p style="background:#FBF7EE;border:1px solid #E5DEC9;border-radius:10px;padding:12px">${escapeHtml(o.instructions)}</p>` : ""}
     <p><strong>Payment:</strong> ${escapeHtml(o.paymentLabel || (o.paymentMethod === "cod" ? "Cash on Delivery" : "Online payment"))}<br>
     <strong>Delivering to:</strong> ${escapeHtml(o.address)}</p>`
  );
  return sendEmail({ to: { email: o.email, name: o.customerName }, subject: `Order ${o.orderNumber} received`, html });
}

export function sendAdminOrderNotification(to: string, o: OrderEmailData) {
  if (!to) return Promise.resolve(false);
  const html = layout(
    `New order ${o.orderNumber}`,
    `<p><strong>${escapeHtml(o.customerName)}</strong> placed an order (${o.paymentMethod.toUpperCase()}).</p>
     ${orderTable(o)}
     <p><strong>Ship to:</strong> ${escapeHtml(o.address)}</p>`
  );
  return sendEmail({ to: { email: to }, subject: `🛍 New order ${o.orderNumber} — ${inr(o.total)}`, html });
}

export function sendOrderStatusEmail(o: { email: string; name: string; orderNumber: string; status: string; trackingUrl?: string; trackingNumber?: string; courier?: string }) {
  if (!o.email) return Promise.resolve(false);
  const labels: Record<string, string> = {
    confirmed: "has been confirmed",
    processing: "is being prepared",
    shipped: "has been shipped",
    delivered: "has been delivered",
    cancelled: "has been cancelled",
    returned: "has been marked as returned",
  };
  const label = labels[o.status];
  if (!label) return Promise.resolve(false);
  const tracking =
    o.status === "shipped" && (o.trackingNumber || o.trackingUrl)
      ? `<p><strong>Courier:</strong> ${escapeHtml(o.courier || "—")}<br><strong>Tracking number:</strong> ${escapeHtml(o.trackingNumber || "—")}
         ${o.trackingUrl ? `<br><a href="${escapeHtml(o.trackingUrl)}" style="color:#8C671A">Track your parcel</a>` : ""}</p>`
      : "";
  const html = layout(`Your order ${label}`, `<p>Hi ${escapeHtml(o.name || "Queen")}, your order <strong>${escapeHtml(o.orderNumber)}</strong> ${label}.</p>${tracking}`);
  return sendEmail({ to: { email: o.email, name: o.name }, subject: `Order ${o.orderNumber} ${label}`, html });
}
