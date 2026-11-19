"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { Alert, SubmitButton } from "@/components/ui/form";
import type { Size, Variant } from "@/components/ui/button-class";

type Action = (prev: { error?: string; message?: string }, fd: FormData) => Promise<{ error?: string; message?: string }>;

/** Confirm-then-submit delete form that shows the server's error message if deletion is blocked. */
export default function DeleteButton({
  action,
  id,
  confirmText,
  label = "Delete",
  size = "md",
  variant = "danger",
  className,
}: {
  action: Action;
  id: string;
  confirmText: string;
  label?: string;
  size?: Size;
  variant?: Variant;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className={size === "sm" ? "inline-block" : "space-y-3"}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton
        variant={variant}
        size={size}
        pending={pending}
        pendingText="Deleting…"
        className={className}
      >
        <Trash2 className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} aria-hidden="true" />
        {label}
      </SubmitButton>
      {state.error && (
        <div className={size === "sm" ? "mt-2 w-full max-w-sm" : ""}>
          <Alert tone="error">{state.error}</Alert>
        </div>
      )}
    </form>
  );
}
