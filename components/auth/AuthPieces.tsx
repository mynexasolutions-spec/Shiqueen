"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { MailCheck } from "lucide-react";
import { Alert, Field, Input, SubmitButton } from "@/components/ui/form";
import { resendVerificationAction, verifyEmailAction, type AuthState } from "@/app/(auth)/actions";

export function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div>
      {eyebrow && <p className="text-[13px] font-bold uppercase tracking-[0.24em] text-[#8C671A]">{eyebrow}</p>}
      <h1 className="mt-1 font-serif text-[36px] font-bold leading-tight text-[#171717] sm:text-[40px]">{title}</h1>
      {subtitle && <p className="mt-2 text-[17px] leading-relaxed text-[#171717]/70">{subtitle}</p>}
      <div className="mt-8">{children}</div>
      {footer && <div className="mt-8">{footer}</div>}
    </div>
  );
}

/** “or” divider + secondary action, shown at the end of the auth forms. */
export function AuthSwitch({ prompt, href, label }: { prompt: string; href: string; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-4 text-[15px] text-[#171717]/50" aria-hidden="true">
        <span className="h-px flex-1 bg-[#E5DEC9]" />
        or
        <span className="h-px flex-1 bg-[#E5DEC9]" />
      </div>
      <p className="mt-5 text-center text-base text-[#171717]/70">{prompt}</p>
      <Link
        href={href}
        className="mt-3 flex h-13 w-full items-center justify-center rounded-xl border-2 border-[#171717] text-[17px] font-semibold text-[#171717] transition hover:border-[#8C671A] hover:bg-[#FBF7EE] hover:text-[#8C671A]"
      >
        {label}
      </Link>
    </div>
  );
}

export function StateAlerts({ state }: { state: AuthState }) {
  return (
    <>
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {!state.error && state.message && <Alert tone="success">{state.message}</Alert>}
    </>
  );
}

export function OtpInput({ autoFocus = true }: { autoFocus?: boolean }) {
  return (
    <Input
      id="code"
      name="code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]{6}"
      maxLength={6}
      required
      autoFocus={autoFocus}
      placeholder="••••••"
      className="h-16 text-center font-mono text-3xl tracking-[0.5em]"
    />
  );
}

/** Email verification step used after sign-up, or when an unverified user signs in. */
export function VerifyEmailStep({ email, next, initial }: { email: string; next: string; initial?: AuthState }) {
  const [state, verify, verifying] = useActionState(verifyEmailAction, initial ?? {});
  const [resendState, resend, resending] = useActionState(resendVerificationAction, {});
  const shown = resendState.error || resendState.message ? resendState : state;

  return (
    <AuthCard
      title="Verify your email"
      subtitle={
        <>
          Enter the 6-digit code we sent to <strong className="text-[#171717]">{email}</strong>. It expires in 10 minutes.
        </>
      }
    >
      <div className="mb-6 flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FBF3DF] text-[#8C671A]">
          <MailCheck className="h-8 w-8" aria-hidden="true" />
        </span>
      </div>
      <form action={verify} className="space-y-5">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="next" value={next} />
        <StateAlerts state={shown} />
        <Field label="Verification code" htmlFor="code">
          <OtpInput />
        </Field>
        <SubmitButton size="lg" className="w-full" pending={verifying} pendingText="Verifying…">
          Verify & continue
        </SubmitButton>
      </form>
      <form action={resend} className="mt-4 text-center">
        <input type="hidden" name="email" value={email} />
        <p className="text-base text-[#171717]/70">
          Didn&apos;t get it? Check your spam folder or{" "}
          <button type="submit" disabled={resending} className="font-semibold text-[#8C671A] underline-offset-4 hover:underline disabled:opacity-60">
            {resending ? "sending…" : "send a new code"}
          </button>
        </p>
      </form>
    </AuthCard>
  );
}
