"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Field, Input, SubmitButton } from "@/components/ui/form";
import { signupAction } from "@/app/(auth)/actions";
import { AuthCard, AuthSwitch, StateAlerts, VerifyEmailStep } from "./AuthPieces";
import { PasswordInput } from "./LoginForm";

export default function SignupForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState(signupAction, {});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (state.step === "verify" && state.email) {
    return <VerifyEmailStep email={state.email} next={next} initial={{ message: state.message, error: state.error }} />;
  }

  return (
    <AuthCard
      eyebrow="Join Shiqueen"
      title="Create your account"
      subtitle="It takes a minute. We'll send a code to verify your email."
      footer={<AuthSwitch prompt="Already have an account?" href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} label="Sign in" />}
    >
      <form action={action} className="space-y-5">
        <StateAlerts state={state} />
        <Field label="Full name" htmlFor="name" required>
          <Input id="name" name="name" autoComplete="name" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email address" htmlFor="email" required hint="We'll send a code to verify this email.">
          <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password" htmlFor="password" required hint="At least 8 characters, with a letter and a number.">
          <PasswordInput autoComplete="new-password" />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword" required>
          <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" />
        </Field>
        <SubmitButton size="lg" className="w-full" pending={pending} pendingText="Creating account…">
          Create account
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
