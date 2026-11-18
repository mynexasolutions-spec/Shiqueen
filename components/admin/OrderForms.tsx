"use client";

import { useActionState } from "react";
import { Alert, Checkbox, Field, Input, Select, SubmitButton, Textarea } from "@/components/ui/form";
import {
  updateAdminNotesAction,
  updateOrderStatusAction,
  updatePaymentStatusAction,
  updateShippingAction,
  type FormState,
} from "@/app/admin/_actions/orders";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, PAYMENT_STATUSES, PAYMENT_STATUS_LABEL, type OrderStatus, type PaymentStatus } from "@/lib/format";

function Feedback({ state }: { state: FormState }) {
  if (state.error) return <Alert tone="error">{state.error}</Alert>;
  if (state.message) return <Alert tone="success">{state.message}</Alert>;
  return null;
}

export function StatusForm({ id, status, hasEmail }: { id: string; status: OrderStatus; hasEmail: boolean }) {
  const [state, action, pending] = useActionState(updateOrderStatusAction, {});
  const locked = status === "cancelled" || status === "returned";
  if (locked) {
    return (
      <div className="space-y-4">
        <Feedback state={state} />
        <p className="text-base text-[#171717]/70">This order is {ORDER_STATUS_LABEL[status].toLowerCase()} and can no longer be changed.</p>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <Feedback state={state} />
      <Field label="Order status" htmlFor="status">
        <Select id="status" name="status" defaultValue={status} key={status}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Note (optional)" htmlFor="note" hint="Saved in the order timeline.">
        <Input id="note" name="note" maxLength={500} placeholder="e.g. Packed and handed to courier" />
      </Field>
      {hasEmail && <Checkbox name="notify" defaultChecked label="Email the customer about this update" />}
      <SubmitButton className="w-full" pending={pending} pendingText="Updating…">
        Update status
      </SubmitButton>
      <p className="text-[15px] text-[#171717]/60">Cancelling or marking as returned puts the items back in stock.</p>
    </form>
  );
}

export function PaymentForm({ id, paymentStatus }: { id: string; paymentStatus: PaymentStatus }) {
  const [state, action, pending] = useActionState(updatePaymentStatusAction, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <Feedback state={state} />
      <Field label="Payment status" htmlFor="payment_status">
        <Select id="payment_status" name="payment_status" defaultValue={paymentStatus} key={paymentStatus}>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {PAYMENT_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </Field>
      <SubmitButton variant="secondary" className="w-full" pending={pending} pendingText="Saving…">
        Save payment status
      </SubmitButton>
    </form>
  );
}

export function ShippingForm({ id, courier, trackingNumber, trackingUrl }: { id: string; courier: string; trackingNumber: string; trackingUrl: string }) {
  const [state, action, pending] = useActionState(updateShippingAction, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <Feedback state={state} />
      <Field label="Courier" htmlFor="courier">
        <Input id="courier" name="courier" maxLength={80} defaultValue={courier} placeholder="e.g. Delhivery" />
      </Field>
      <Field label="Tracking number" htmlFor="tracking_number">
        <Input id="tracking_number" name="tracking_number" maxLength={120} defaultValue={trackingNumber} />
      </Field>
      <Field label="Tracking link" htmlFor="tracking_url">
        <Input id="tracking_url" name="tracking_url" type="url" maxLength={500} defaultValue={trackingUrl} placeholder="https://" />
      </Field>
      <SubmitButton variant="secondary" className="w-full" pending={pending} pendingText="Saving…">
        Save shipping details
      </SubmitButton>
      <p className="text-[15px] text-[#171717]/60">Tip: save these first, then set the status to “Shipped” so the email includes tracking.</p>
    </form>
  );
}

export function NotesForm({ id, notes }: { id: string; notes: string }) {
  const [state, action, pending] = useActionState(updateAdminNotesAction, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <Feedback state={state} />
      <Textarea name="admin_notes" rows={4} maxLength={3000} defaultValue={notes} aria-label="Internal notes" placeholder="Only visible to admins" />
      <SubmitButton variant="secondary" pending={pending} pendingText="Saving…">
        Save notes
      </SubmitButton>
    </form>
  );
}
