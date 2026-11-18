"use server";

import { refresh } from "next/cache";
import { sql } from "@/lib/server/db";
import { destroyAllSessions, requireAdmin } from "@/lib/server/session";
import { isUuid } from "@/lib/server/admin/categories";

export interface FormState {
  error?: string;
  message?: string;
}

export async function setCustomerActiveAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const active = fd.get("active") === "true";
  if (!isUuid(id)) return { error: "Invalid customer." };
  if (id === admin.id) return { error: "You can't disable your own account." };
  const updated = await sql`update users set is_active = ${active}, updated_at = now() where id = ${id} returning id`;
  if (!updated.length) return { error: "Customer not found." };
  if (!active) await destroyAllSessions(id); // sign them out everywhere
  refresh();
  return { message: active ? "Account enabled." : "Account disabled and signed out." };
}

export async function setUserRoleAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const role = fd.get("role") === "admin" ? "admin" : "customer";
  if (!isUuid(id)) return { error: "Invalid user." };
  if (id === admin.id) return { error: "You can't change your own role." };
  const [u] = await sql<{ verified: boolean }[]>`select (email_verified_at is not null) as verified from users where id = ${id}`;
  if (!u) return { error: "User not found." };
  if (role === "admin" && !u.verified) return { error: "Only users with a verified email can be made admins." };
  await sql`update users set role = ${role}, updated_at = now() where id = ${id}`;
  await destroyAllSessions(id); // new permissions apply on next sign-in
  refresh();
  return { message: role === "admin" ? "User is now an admin." : "Admin access removed." };
}
