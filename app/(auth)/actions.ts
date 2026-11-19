"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "@/lib/server/db";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/server/password";
import { createSession, destroyAllSessions, destroySession, type Role } from "@/lib/server/session";
import { issueOtp, verifyOtp } from "@/lib/server/otp";

export interface AuthState {
  error?: string;
  message?: string;
  /** Which step the form should show next. */
  step?: "verify" | "otp-code" | "reset-code";
  email?: string;
}

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address.").max(200);

const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;
const DUMMY_HASH =
  "scrypt$16384$8$1$XGNG7YiF5Kk5v7yr7y_ysw$TkS9QX8pomAh5jgXRT7M1dSTXJu7xEd_nwaJm-mejrwx4fA6RjHBw6DtOKxGqu1KyzaVhkV_WMcsu43oeZkVfA";

function safeNext(next: FormDataEntryValue | null, role: Role) {
  const n = typeof next === "string" ? next : "";
  const valid =
    n.startsWith("/") &&
    !n.startsWith("//") &&
    !n.startsWith("/\\") &&
    !n.startsWith("/login") &&
    !n.startsWith("/signup") &&
    !n.startsWith("/admin/login");
  if (role === "admin") {
    if (n === "/admin/dashboard" || n === "/admin/login") return "/admin";
    return valid && n.startsWith("/admin") ? n : "/admin";
  }
  return valid && !n.startsWith("/admin") ? n : "/account";
}

function parseEmail(formData: FormData): string | null {
  const r = emailSchema.safeParse(formData.get("email"));
  return r.success ? r.data : null;
}

// ───────────────────────── Sign up ─────────────────────────

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = parseEmail(formData);
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!name) return { error: "Please enter your name." };
  if (!email) return { error: "Enter a valid email address." };
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  if (password !== confirm) return { error: "Passwords do not match." };

  const [existing] = await sql<{ id: string; verified: boolean }[]>`
    select id, (email_verified_at is not null) as verified from users where email = ${email}`;
  if (existing?.verified) {
    return { error: "An account with this email already exists. Please sign in instead." };
  }

  const hash = await hashPassword(password);
  if (existing) {
    await sql`update users set name = ${name}, password_hash = ${hash}, updated_at = now() where id = ${existing.id}`;
  } else {
    await sql`insert into users (email, name, password_hash) values (${email}, ${name}, ${hash})`;
  }

  const err = await issueOtp(email, "verify");
  if (err) return { error: err, step: "verify", email };
  return { step: "verify", email, message: `We've sent a 6-digit code to ${email}.` };
}

export async function verifyEmailAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = parseEmail(formData);
  if (!email) return { error: "Enter a valid email address." };
  const code = String(formData.get("code") ?? "");

  const err = await verifyOtp(email, "verify", code);
  if (err) return { error: err, step: "verify", email };

  const [user] = await sql<{ id: string; role: Role; is_active: boolean }[]>`
    update users set email_verified_at = coalesce(email_verified_at, now()), updated_at = now()
    where email = ${email} returning id, role, is_active`;
  if (!user) return { error: "Account not found. Please sign up again." };
  if (!user.is_active) return { error: "This account has been disabled. Please contact support." };

  await createSession(user.id);
  redirect(safeNext(formData.get("next"), user.role));
}

export async function resendVerificationAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = parseEmail(formData);
  if (!email) return { error: "Enter a valid email address." };
  const [user] = await sql<{ verified: boolean }[]>`select (email_verified_at is not null) as verified from users where email = ${email}`;
  if (!user) return { error: "Account not found. Please sign up again.", step: "verify", email };
  if (user.verified) return { message: "Your email is already verified. Please sign in.", email };
  const err = await issueOtp(email, "verify");
  return err ? { error: err, step: "verify", email } : { message: "A new code is on its way.", step: "verify", email };
}

// ───────────────────────── Sign in with password ─────────────────────────

export async function loginWithPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = parseEmail(formData);
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const [user] = await sql<
    { id: string; role: Role; password_hash: string | null; verified: boolean; is_active: boolean; failed_login_count: number; locked: boolean }[]
  >`select id, role, password_hash, (email_verified_at is not null) as verified, is_active, failed_login_count,
           (locked_until is not null and locked_until > now()) as locked
    from users where email = ${email}`;

  if (user?.locked) {
    return { error: `Too many failed attempts. Try again in ${LOCK_MINUTES} minutes, or sign in with an email code.` };
  }

  // Always run a full hash comparison so response time doesn't reveal whether the email exists.
  const ok = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !ok) {
    if (user) {
      await sql`update users set failed_login_count = failed_login_count + 1,
                  locked_until = case when failed_login_count + 1 >= ${MAX_FAILED_LOGINS}
                                      then now() + make_interval(mins => ${LOCK_MINUTES}) else locked_until end
                where id = ${user.id}`;
    }
    return { error: "Incorrect email or password." };
  }
  if (!user.is_active) return { error: "This account has been disabled. Please contact support." };

  if (!user.verified) {
    const err = await issueOtp(email, "verify");
    return {
      step: "verify",
      email,
      error: err ?? undefined,
      message: err ? undefined : "Please verify your email first. We've sent you a 6-digit code.",
    };
  }

  await createSession(user.id);
  redirect(safeNext(formData.get("next"), user.role));
}

// ───────────────────────── Sign in with email code ─────────────────────────

export async function requestLoginOtpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = parseEmail(formData);
  if (!email) return { error: "Enter a valid email address." };

  const [user] = await sql<{ verified: boolean; is_active: boolean }[]>`
    select (email_verified_at is not null) as verified, is_active from users where email = ${email}`;

  const generic: AuthState = { step: "otp-code", email, message: `If an account exists for ${email}, we've sent a 6-digit sign-in code.` };
  if (!user || !user.is_active) return generic;
  if (!user.verified) {
    const err = await issueOtp(email, "verify");
    return { step: "verify", email, error: err ?? undefined, message: err ? undefined : "Please verify your email first. We've sent you a 6-digit code." };
  }
  const err = await issueOtp(email, "login");
  return err ? { ...generic, message: undefined, error: err } : generic;
}

export async function verifyLoginOtpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = parseEmail(formData);
  if (!email) return { error: "Enter a valid email address." };
  const err = await verifyOtp(email, "login", String(formData.get("code") ?? ""));
  if (err) return { error: err, step: "otp-code", email };

  const [user] = await sql<{ id: string; role: Role; is_active: boolean }[]>`select id, role, is_active from users where email = ${email}`;
  if (!user || !user.is_active) return { error: "This account is not available. Please contact support." };
  await createSession(user.id);
  redirect(safeNext(formData.get("next"), user.role));
}

// ───────────────────────── Forgot password ─────────────────────────

export async function requestPasswordResetAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = parseEmail(formData);
  if (!email) return { error: "Enter a valid email address." };
  const [user] = await sql<{ is_active: boolean }[]>`select is_active from users where email = ${email}`;
  const generic: AuthState = { step: "reset-code", email, message: `If an account exists for ${email}, we've sent a reset code.` };
  if (!user || !user.is_active) return generic;
  const err = await issueOtp(email, "reset");
  return err ? { step: "reset-code", email, error: err } : generic;
}

export async function resetPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = parseEmail(formData);
  if (!email) return { error: "Enter a valid email address." };
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  const problem = passwordProblem(password);
  if (problem) return { error: problem, step: "reset-code", email };
  if (password !== confirm) return { error: "Passwords do not match.", step: "reset-code", email };

  const err = await verifyOtp(email, "reset", String(formData.get("code") ?? ""));
  if (err) return { error: err, step: "reset-code", email };

  const hash = await hashPassword(password);
  const [user] = await sql<{ id: string; role: Role; is_active: boolean }[]>`
    update users set password_hash = ${hash}, email_verified_at = coalesce(email_verified_at, now()),
                     failed_login_count = 0, locked_until = null, updated_at = now()
    where email = ${email} returning id, role, is_active`;
  if (!user || !user.is_active) return { error: "This account is not available. Please contact support." };

  await destroyAllSessions(user.id);
  await createSession(user.id);
  redirect(safeNext(null, user.role));
}

// ───────────────────────── Sign out ─────────────────────────

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
