import type { Metadata } from "next";
import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";
import RedirectIfSignedIn from "@/components/auth/RedirectIfSignedIn";
import AuthSkeleton from "@/components/auth/AuthSkeleton";

export const metadata: Metadata = { title: "Create account | SHIQUEEN", robots: { index: false } };

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <Suspense fallback={<AuthSkeleton />}>
        <SignupForm />
      </Suspense>
    </>
  );
}
