"use client";

import { useActionState } from "react";
import { Alert, Field, Input, SubmitButton } from "@/components/ui/form";
import { updateProfileAction } from "@/app/account/_actions";

export default function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, {});
  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.message && <Alert tone="success">{state.message}</Alert>}
      <Field label="Email address" htmlFor="email" hint="Your sign-in email can't be changed here.">
        <Input id="email" value={email} disabled readOnly />
      </Field>
      <Field label="Full name" htmlFor="name" required>
        <Input id="name" name="name" required maxLength={100} autoComplete="name" defaultValue={name} />
      </Field>
      <Field label="Mobile number" htmlFor="phone">
        <Input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={phone} placeholder="10-digit mobile number" />
      </Field>
      <SubmitButton pending={pending} pendingText="Saving…">
        Save profile
      </SubmitButton>
    </form>
  );
}
