import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RedirectIfSignedIn from "@/components/auth/RedirectIfSignedIn";
import AuthSkeleton from "@/components/auth/AuthSkeleton";

export const metadata: Metadata = { title: "Sign in | SHIQUEEN", robots: { index: false } };

export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <Suspense fallback={<AuthSkeleton />}>
        <LoginForm />
      </Suspense>
    </>
  );
}
