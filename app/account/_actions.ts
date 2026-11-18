"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";
import { sql } from "@/lib/server/db";
import { requireUser, SESSION_COOKIE } from "@/lib/server/session";
import { hashPassword, passwordProblem, verifyPassword } from "@/lib/server/password";
import { isUuid } from "@/lib/server/admin/categories";

export interface FormState {
  error?: string;
  message?: string;
}

const str = (fd: FormData, key: string, max = 300) => String(fd.get(key) ?? "").trim().slice(0, max);

export async function updateProfileAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = str(fd, "name", 100);
  const phone = str(fd, "phone", 15).replace(/[\s-]/g, "");
  if (!name) return { error: "Please enter your name." };
  if (phone && !/^(\+?91)?[6-9]\d{9}$/.test(phone)) return { error: "Please enter a valid 10-digit mobile number." };
  await sql`update users set name = ${name}, phone = ${phone}, updated_at = now() where id = ${user.id}`;
  refresh();
  return { message: "Profile updated." };
}

/** Works for customers and admins: changes the signed-in user's own password. */
export async function changePasswordAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const current = String(fd.get("current_password") ?? "");
  const next = String(fd.get("new_password") ?? "");
  const confirm = String(fd.get("confirm_password") ?? "");

  const [row] = await sql<{ password_hash: string | null }[]>`select password_hash from users where id = ${user.id}`;
  if (!(await verifyPassword(current, row?.password_hash))) return { error: "Your current password is incorrect." };
  const problem = passwordProblem(next);
  if (problem) return { error: problem };
  if (next !== confirm) return { error: "New passwords do not match." };
  if (next === current) return { error: "Choose a password different from your current one." };

  await sql`update users set password_hash = ${await hashPassword(next)}, updated_at = now() where id = ${user.id}`;
  // Sign out every other device; keep this session.
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? "";
  const keep = createHash("sha256").update(token).digest("hex");
  await sql`delete from sessions where user_id = ${user.id} and token_hash <> ${keep}`;
  return { message: "Password changed. Other devices have been signed out." };
}

function readAddress(fd: FormData) {
  return {
    full_name: str(fd, "full_name", 100),
    phone: str(fd, "phone", 15).replace(/[\s-]/g, ""),
    line1: str(fd, "line1", 300),
    line2: str(fd, "line2", 300),
    city: str(fd, "city", 80),
    state: str(fd, "state", 80),
    pincode: str(fd, "pincode", 6),
  };
}

function addressProblem(a: ReturnType<typeof readAddress>) {
  if (!a.full_name || !a.line1 || !a.city || !a.state) return "Please fill in all required address fields.";
  if (!/^(\+?91)?[6-9]\d{9}$/.test(a.phone)) return "Please enter a valid 10-digit mobile number.";
  if (!/^\d{6}$/.test(a.pincode)) return "Please enter a valid 6-digit pincode.";
  return null;
}

export async function saveAddressAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = str(fd, "id", 40);
  const a = readAddress(fd);
  const problem = addressProblem(a);
  if (problem) return { error: problem };
  const makeDefault = fd.get("is_default") === "on";

  const editing = Boolean(id && isUuid(id));
  const [{ count }] = await sql<{ count: number }[]>`select count(*)::int as count from addresses where user_id = ${user.id}`;
  if (!editing && count >= 10) return { error: "You can save up to 10 addresses. Remove one first." };

  await sql.begin(async (tx) => {
    const isDefault = makeDefault || count === 0;
    if (isDefault) await tx`update addresses set is_default = false where user_id = ${user.id}`;
    if (editing) {
      await tx`update addresses set ${tx(a)}, is_default = ${isDefault} where id = ${id} and user_id = ${user.id}`;
    } else {
      await tx`insert into addresses ${tx({ ...a, user_id: user.id, is_default: isDefault })}`;
    }
  });
  refresh();
  return { message: id ? "Address updated." : "Address saved." };
}

export async function deleteAddressAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const user = await requireUser();
  const id = str(fd, "id", 40);
  if (!isUuid(id)) return { error: "Invalid address." };
  await sql`delete from addresses where id = ${id} and user_id = ${user.id}`;
  refresh();
  return { message: "Address removed." };
}
