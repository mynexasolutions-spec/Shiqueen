"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Alert, SubmitButton } from "@/components/ui/form";

type Action = (prev: { error?: string; message?: string }, fd: FormData) => Promise<{ error?: string; message?: string }>;

/** Confirm-then-submit delete form that shows the server's error message if deletion is blocked. */
export default function DeleteButton({
  action,
  id,
  confirmText,
  label = "Delete",
}: {
  action: Action;
  id: string;
  confirmText: string;
  label?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="space-y-3"
    >
      <input type="hidden" name="id" value={id} />
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <SubmitButton variant="danger" pending={pending} pendingText="Deleting…">
        <Trash2 className="h-5 w-5" aria-hidden="true" />
        {label}
      </SubmitButton>
    </form>
  );
}
