"use client";

import { useActionState, useState } from "react";
import { Field, Input, SubmitButton } from "@/components/ui/form";
import { requestPasswordResetAction, resetPasswordAction } from "@/app/(auth)/actions";
import { AuthCard, AuthSwitch, OtpInput, StateAlerts } from "./AuthPieces";
import { PasswordInput } from "./LoginForm";

export default function ForgotPasswordForm() {
  const [reqState, reqAction, reqPending] = useActionState(requestPasswordResetAction, {});
  const [resetState, resetAction, resetPending] = useActionState(resetPasswordAction, {});
  const [email, setEmail] = useState("");
  const sentTo = reqState.step === "reset-code" ? reqState.email : undefined;

  return (
    <AuthCard
      eyebrow="Account help"
      title="Reset your password"
      subtitle="Enter your email and we'll send you a code to set a new password."
      footer={<AuthSwitch prompt="Remembered your password?" href="/login" label="Back to sign in" />}
    >
      {!sentTo ? (
        <form action={reqAction} className="space-y-5">
          <StateAlerts state={reqState} />
          <Field label="Email address" htmlFor="email" hint="We'll email you a 6-digit code to reset your password.">
            <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <SubmitButton size="lg" className="w-full" pending={reqPending} pendingText="Sending code…">
            Send reset code
          </SubmitButton>
        </form>
      ) : (
        <div className="space-y-4">
          <form action={resetAction} className="space-y-5">
            <input type="hidden" name="email" value={sentTo} />
            <StateAlerts state={resetState.error ? resetState : reqState} />
            <Field label="6-digit code" htmlFor="code">
              <OtpInput />
            </Field>
            <Field label="New password" htmlFor="password" hint="At least 8 characters, with a letter and a number.">
              <PasswordInput autoComplete="new-password" />
            </Field>
            <Field label="Confirm new password" htmlFor="confirmPassword">
              <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" />
            </Field>
            <SubmitButton size="lg" className="w-full" pending={resetPending} pendingText="Saving…">
              Set new password
            </SubmitButton>
          </form>
          <form action={reqAction} className="text-center">
            <input type="hidden" name="email" value={sentTo} />
            <button type="submit" disabled={reqPending} className="text-base font-semibold text-[#8C671A] hover:underline disabled:opacity-60">
              {reqPending ? "Sending…" : "Send a new code"}
            </button>
          </form>
        </div>
      )}
    </AuthCard>
  );
}
