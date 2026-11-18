"use client";

import { useActionState } from "react";
import { Alert, SubmitButton } from "@/components/ui/form";
import { setCustomerActiveAction, setUserRoleAction } from "@/app/admin/_actions/customers";

export default function CustomerActions({ id, isActive, role, isSelf }: { id: string; isActive: boolean; role: "customer" | "admin"; isSelf: boolean }) {
  const [activeState, activeAction, activePending] = useActionState(setCustomerActiveAction, {});
  const [roleState, roleAction, rolePending] = useActionState(setUserRoleAction, {});
  const state = activeState.error || activeState.message ? activeState : roleState;

  if (isSelf) return <p className="text-base text-[#171717]/70">This is your own account.</p>;

  return (
    <div className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      {state.message && <Alert tone="success">{state.message}</Alert>}

      <form
        action={activeAction}
        onSubmit={(e) => {
          if (isActive && !window.confirm("Disable this account? They'll be signed out and won't be able to sign in.")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="active" value={String(!isActive)} />
        <SubmitButton variant={isActive ? "danger" : "primary"} className="w-full" pending={activePending} pendingText="Saving…">
          {isActive ? "Disable account" : "Enable account"}
        </SubmitButton>
      </form>

      <form
        action={roleAction}
        onSubmit={(e) => {
          const msg =
            role === "admin"
              ? "Remove admin access from this user?"
              : "Give this user FULL admin access to the dashboard (products, orders, customers, settings)?";
          if (!window.confirm(msg)) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="role" value={role === "admin" ? "customer" : "admin"} />
        <SubmitButton variant="secondary" className="w-full" pending={rolePending} pendingText="Saving…">
          {role === "admin" ? "Remove admin access" : "Make admin"}
        </SubmitButton>
      </form>
    </div>
  );
}
