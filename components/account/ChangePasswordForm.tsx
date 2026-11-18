"use client";

import { useActionState, useRef, useEffect } from "react";
import { Alert, Field, SubmitButton } from "@/components/ui/form";
import { PasswordInput } from "@/components/auth/LoginForm";
import { changePasswordAction } from "@/app/account/_actions";

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.message) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.message && <Alert tone="success">{state.message}</Alert>}
      <Field label="Current password" htmlFor="current_password">
        <PasswordInput id="current_password" name="current_password" autoComplete="current-password" />
      </Field>
      <Field label="New password" htmlFor="new_password" hint="At least 8 characters, with a letter and a number.">
        <PasswordInput id="new_password" name="new_password" autoComplete="new-password" />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm_password">
        <PasswordInput id="confirm_password" name="confirm_password" autoComplete="new-password" />
      </Field>
      <SubmitButton pending={pending} pendingText="Saving…">
        Change password
      </SubmitButton>
    </form>
  );
}
