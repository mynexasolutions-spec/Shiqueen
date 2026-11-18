import type { Metadata } from "next";
import { Suspense } from "react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import RedirectIfSignedIn from "@/components/auth/RedirectIfSignedIn";
import AuthSkeleton from "@/components/auth/AuthSkeleton";

export const metadata: Metadata = { title: "Reset password | SHIQUEEN", robots: { index: false } };

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <Suspense fallback={<AuthSkeleton />}>
        <ForgotPasswordForm />
      </Suspense>
    </>
  );
}
