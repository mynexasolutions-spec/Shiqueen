import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { sql } from "./db";

export const SESSION_COOKIE = "sq_session";
const SESSION_DAYS = 30;

export type Role = "customer" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

/** Creates a DB-backed session and sets the httpOnly cookie. Server Actions / Route Handlers only. */
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim().slice(0, 64);
  const ua = (h.get("user-agent") ?? "").slice(0, 300);

  await sql`insert into sessions (user_id, token_hash, expires_at, ip, user_agent)
            values (${userId}, ${sha256(token)}, ${expires}, ${ip}, ${ua})`;
  await sql`update users set last_login_at = now(), failed_login_count = 0, locked_until = null where id = ${userId}`;
  // Opportunistic cleanup of this user's expired sessions.
  await sql`delete from sessions where user_id = ${userId} and expires_at < now()`;

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await sql`delete from sessions where token_hash = ${sha256(token)}`;
  store.delete(SESSION_COOKIE);
}

/** Ends every session for a user (e.g. after a password reset or deactivation). */
export async function destroyAllSessions(userId: string) {
  await sql`delete from sessions where user_id = ${userId}`;
}

/** The signed-in user for this request, or null. Deduplicated per request. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const rows = await sql<SessionUser[]>`
    select u.id, u.email::text as email, u.name, u.phone, u.role
    from sessions s join users u on u.id = s.user_id
    where s.token_hash = ${sha256(token)} and s.expires_at > now()
      and u.is_active and u.email_verified_at is not null
    limit 1`;
  return rows[0] ?? null;
});

export async function requireUser(next = "/account"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

/** Use at the top of EVERY admin data function and Server Action. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/account");
  return user;
}
