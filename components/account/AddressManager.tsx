"use client";

import { useActionState, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Alert, Button, Checkbox, Field, Input, SubmitButton } from "@/components/ui/form";
import { Badge } from "@/components/admin/ui";
import { deleteAddressAction, saveAddressAction } from "@/app/account/_actions";

export interface Address {
  id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

function AddressForm({ address, onDone }: { address?: Address; onDone: () => void }) {
  const [state, action, pending] = useActionState(saveAddressAction, {});
  useEffect(() => {
    if (state.message) onDone();
  }, [state, onDone]);

  return (
    <form action={action} className="space-y-5 rounded-2xl border border-[#E5DEC9] bg-white p-5 sm:p-6">
      {address && <input type="hidden" name="id" value={address.id} />}
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="full_name" required>
          <Input id="full_name" name="full_name" required autoComplete="name" defaultValue={address?.full_name} />
        </Field>
        <Field label="Mobile number" htmlFor="phone" required>
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue={address?.phone} />
        </Field>
      </div>
      <Field label="House no., building, street" htmlFor="line1" required>
        <Input id="line1" name="line1" required autoComplete="address-line1" defaultValue={address?.line1} />
      </Field>
      <Field label="Area, landmark (optional)" htmlFor="line2">
        <Input id="line2" name="line2" autoComplete="address-line2" defaultValue={address?.line2} />
      </Field>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field label="Pincode" htmlFor="pincode" required>
          <Input id="pincode" name="pincode" inputMode="numeric" maxLength={6} required autoComplete="postal-code" defaultValue={address?.pincode} />
        </Field>
        <Field label="City" htmlFor="city" required>
          <Input id="city" name="city" required autoComplete="address-level2" defaultValue={address?.city} />
        </Field>
        <Field label="State" htmlFor="state" required>
          <Input id="state" name="state" required autoComplete="address-level1" defaultValue={address?.state} />
        </Field>
      </div>
      <Checkbox name="is_default" defaultChecked={address?.is_default ?? false} label="Use as my default address" hint="Pre-filled at checkout." />
      <div className="flex flex-wrap gap-3">
        <SubmitButton pending={pending} pendingText="Saving…">
          Save address
        </SubmitButton>
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function DeleteAddress({ id }: { id: string }) {
  const [, action, pending] = useActionState(deleteAddressAction, {});
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm("Remove this address?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-base font-semibold text-[#B42318] hover:bg-[#FEF3F2] disabled:opacity-50">
        <Trash2 className="h-5 w-5" aria-hidden="true" /> Remove
      </button>
    </form>
  );
}

export default function AddressManager({ addresses }: { addresses: Address[] }) {
  const [editing, setEditing] = useState<string | "new" | null>(addresses.length === 0 ? "new" : null);
  const close = () => setEditing(null);

  return (
    <div className="space-y-4">
      {addresses.map((a) =>
        editing === a.id ? (
          <AddressForm key={a.id} address={a} onDone={close} />
        ) : (
          <div key={a.id} className="flex flex-col gap-3 rounded-2xl border border-[#E5DEC9] bg-white p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div className="text-base leading-relaxed">
              <p className="flex flex-wrap items-center gap-2 text-[17px] font-semibold">
                {a.full_name} {a.is_default && <Badge tone="gold">Default</Badge>}
              </p>
              <p>
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
              </p>
              <p>
                {a.city}, {a.state} – {a.pincode}
              </p>
              <p className="text-[#171717]/65">{a.phone}</p>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => setEditing(a.id)} className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-base font-semibold hover:bg-[#F3EEE4]">
                <Pencil className="h-5 w-5" aria-hidden="true" /> Edit
              </button>
              <DeleteAddress id={a.id} />
            </div>
          </div>
        )
      )}

      {editing === "new" ? (
        <AddressForm onDone={close} />
      ) : (
        addresses.length < 10 && (
          <Button type="button" variant="secondary" onClick={() => setEditing("new")}>
            <Plus className="h-5 w-5" aria-hidden="true" /> Add a new address
          </Button>
        )
      )}
    </div>
  );
}
