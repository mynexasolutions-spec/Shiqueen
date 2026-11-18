import type { Metadata } from "next";
import { requireUser } from "@/lib/server/session";
import { Card } from "@/components/admin/ui";
import ProfileForm from "@/components/account/ProfileForm";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";

export const metadata: Metadata = { title: "Profile & password" };

// Depends on the signed-in session, so it renders per request (no instant-navigation check).
export const instant = false;

export default async function ProfilePage() {
  const user = await requireUser();
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-[34px] font-bold leading-tight sm:text-[40px]">Profile & password</h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Your details">
          <ProfileForm name={user.name} phone={user.phone} email={user.email} />
        </Card>
        <Card title="Change password" description="Forgot it? Sign out and use “Forgot password” or sign in with an email code.">
          <ChangePasswordForm />
        </Card>
      </div>
    </div>
  );
}
