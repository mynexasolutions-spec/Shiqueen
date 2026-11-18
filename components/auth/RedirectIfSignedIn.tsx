import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/session";

/** Sends already signed-in visitors to their dashboard. Render inside <Suspense>. */
export default async function RedirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/account");
  return null;
}
