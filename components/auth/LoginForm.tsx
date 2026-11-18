"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Field, Input, SubmitButton } from "@/components/ui/form";
import {
  loginWithPasswordAction,
  requestLoginOtpAction,
  verifyLoginOtpAction,
} from "@/app/(auth)/actions";
import { AuthCard, AuthSwitch, OtpInput, StateAlerts, VerifyEmailStep } from "./AuthPieces";

export function PasswordInput({ id = "password", name = "password", autoComplete = "current-password" }: { id?: string; name?: string; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} name={name} type={show ? "text" : "password"} autoComplete={autoComplete} required className="pr-14" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-[#171717]/60 hover:text-[#8C671A]"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

export default function LoginForm() {
  const next = useSearchParams().get("next") ?? "";
  const [mode, setMode] = useState<"password" | "otp">("password");

  const [pwState, pwAction, pwPending] = useActionState(loginWithPasswordAction, {});
  const [reqState, reqAction, reqPending] = useActionState(requestLoginOtpAction, {});
  const [codeState, codeAction, codePending] = useActionState(verifyLoginOtpAction, {});
  const [email, setEmail] = useState("");

  // Unverified account → show verification step.
  const verifyFrom = pwState.step === "verify" ? pwState : reqState.step === "verify" ? reqState : null;
  if (verifyFrom?.email) {
    return <VerifyEmailStep email={verifyFrom.email} next={next} initial={{ message: verifyFrom.message, error: verifyFrom.error }} />;
  }

  const otpSentTo = reqState.step === "otp-code" ? reqState.email : undefined;

  return (
    <AuthCard
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Sign in to track your orders, save addresses and check out faster."
      footer={
        <AuthSwitch prompt="New to Shiqueen?" href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} label="Create an account" />
      }
    >
      {/* Mode switch */}
      <div role="tablist" aria-label="Sign-in method" className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-[#F3EEE4] p-1.5">
        {(
          [
            ["password", "Password"],
            ["otp", "Email code"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`h-12 rounded-xl text-base font-semibold transition ${
              mode === key ? "bg-white text-[#171717] shadow-sm" : "text-[#171717]/65 hover:text-[#171717]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "password" ? (
        <form action={pwAction} className="space-y-5">
          <input type="hidden" name="next" value={next} />
          <StateAlerts state={pwState} />
          <Field label="Email address" htmlFor="email">
            <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" htmlFor="password">
            <PasswordInput />
          </Field>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-base font-semibold text-[#8C671A] hover:underline">
              Forgot password?
            </Link>
          </div>
          <SubmitButton size="lg" className="w-full" pending={pwPending} pendingText="Signing in…">
            Sign in
          </SubmitButton>
        </form>
      ) : otpSentTo ? (
        <div className="space-y-5">
          <form action={codeAction} className="space-y-5">
            <input type="hidden" name="email" value={otpSentTo} />
            <input type="hidden" name="next" value={next} />
            <StateAlerts state={codeState.error ? codeState : reqState} />
            <Field label="6-digit code" htmlFor="code" hint={<>Sent to <strong>{otpSentTo}</strong>. It expires in 10 minutes.</>}>
              <OtpInput />
            </Field>
            <SubmitButton size="lg" className="w-full" pending={codePending} pendingText="Checking…">
              Sign in
            </SubmitButton>
          </form>
          <form action={reqAction} className="text-center">
            <input type="hidden" name="email" value={otpSentTo} />
            <button type="submit" disabled={reqPending} className="text-base font-semibold text-[#8C671A] hover:underline disabled:opacity-60">
              {reqPending ? "Sending…" : "Send a new code"}
            </button>
          </form>
        </div>
      ) : (
        <form action={reqAction} className="space-y-5">
          <StateAlerts state={reqState} />
          <Field label="Email address" htmlFor="otp-email" hint="We'll email you a one-time code. No password needed.">
            <Input id="otp-email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <SubmitButton size="lg" className="w-full" pending={reqPending} pendingText="Sending code…">
            Email me a code
          </SubmitButton>
        </form>
      )}
    </AuthCard>
  );
}
