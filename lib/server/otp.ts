import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { sql } from "./db";
import { sendOtpEmail } from "./email";

export type OtpPurpose = "verify" | "login" | "reset";

const OTP_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_PER_HOUR = 5;
const MAX_ATTEMPTS = 5;

function hashCode(email: string, purpose: OtpPurpose, code: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  return createHmac("sha256", secret).update(`${email.toLowerCase()}|${purpose}|${code}`).digest("hex");
}

/** Generates, stores and emails a 6-digit code. Returns an error message or null. */
export async function issueOtp(email: string, purpose: OtpPurpose): Promise<string | null> {
  const [stats] = await sql<{ last_sent: Date | null; sent_last_hour: number }[]>`
    select max(created_at) as last_sent,
           count(*) filter (where created_at > now() - interval '1 hour')::int as sent_last_hour
    from email_otps where email = ${email} and purpose = ${purpose}`;

  if (stats?.last_sent) {
    const elapsed = (Date.now() - new Date(stats.last_sent).getTime()) / 1000;
    if (elapsed < RESEND_COOLDOWN_SECONDS) {
      return `Please wait ${Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed)} seconds before requesting another code.`;
    }
  }
  if ((stats?.sent_last_hour ?? 0) >= MAX_PER_HOUR) {
    return "Too many codes requested. Please try again in an hour.";
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  await sql`update email_otps set consumed_at = now() where email = ${email} and purpose = ${purpose} and consumed_at is null`;
  await sql`insert into email_otps (email, purpose, code_hash, expires_at)
            values (${email}, ${purpose}, ${hashCode(email, purpose, code)}, now() + make_interval(mins => ${OTP_TTL_MINUTES}))`;
  // Tidy up old rows.
  await sql`delete from email_otps where created_at < now() - interval '2 days'`;

  const sent = await sendOtpEmail(email, code, purpose);
  return sent ? null : "We couldn't send the email right now. Please try again in a moment.";
}

/** Checks a code; consumes it on success. Returns an error message or null. */
export async function verifyOtp(email: string, purpose: OtpPurpose, code: string): Promise<string | null> {
  const clean = code.replace(/\D/g, "");
  if (clean.length !== 6) return "Enter the 6-digit code from your email.";

  const [otp] = await sql<{ id: string; code_hash: string; attempts: number; expired: boolean }[]>`
    select id, code_hash, attempts, (expires_at < now()) as expired
    from email_otps
    where email = ${email} and purpose = ${purpose} and consumed_at is null
    order by created_at desc limit 1`;

  if (!otp) return "No active code. Please request a new one.";
  if (otp.expired) return "This code has expired. Please request a new one.";
  if (otp.attempts >= MAX_ATTEMPTS) return "Too many incorrect attempts. Please request a new code.";

  const expected = Buffer.from(otp.code_hash, "hex");
  const actual = Buffer.from(hashCode(email, purpose, clean), "hex");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    await sql`update email_otps set attempts = attempts + 1 where id = ${otp.id}`;
    const left = MAX_ATTEMPTS - otp.attempts - 1;
    return left > 0 ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many incorrect attempts. Please request a new code.";
  }

  await sql`update email_otps set consumed_at = now() where id = ${otp.id}`;
  return null;
}
