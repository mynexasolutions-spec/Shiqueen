"use client";

import { useActionState, useState } from "react";
import { Alert, Checkbox, Field, Input, SubmitButton, Textarea } from "@/components/ui/form";
import { Card } from "@/components/admin/ui";
import { savePageAction } from "@/app/admin/_actions/pages";
import { slugify } from "@/lib/format";

export default function PageForm({ initial }: { initial: { id?: string; title: string; slug: string; body: string; is_published: boolean } }) {
  const [state, action, pending] = useActionState(savePageAction, {});
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [touched, setTouched] = useState(Boolean(initial.id));

  return (
    <form action={action} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="space-y-6 xl:col-span-2">
        {state.error && <Alert tone="error">{state.error}</Alert>}
        {state.message && <Alert tone="success">{state.message}</Alert>}
        <Card>
          <div className="space-y-5">
            <Field label="Title" htmlFor="title" required>
              <Input
                id="title"
                name="title"
                required
                maxLength={150}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!touched) setSlug(slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="Web address" htmlFor="slug" hint={<>shiqueen.in/pages/<strong>{slug || "your-page"}</strong></>}>
              <Input
                id="slug"
                name="slug"
                maxLength={100}
                value={slug}
                onChange={(e) => {
                  setTouched(true);
                  setSlug(e.target.value);
                }}
              />
            </Field>
            <Field
              label="Content"
              htmlFor="body"
              hint={
                <>
                  Leave a blank line between paragraphs. Start a line with <strong>## </strong> for a heading, <strong>- </strong> for a bullet point, and wrap
                  words in <strong>**double stars**</strong> for bold.
                </>
              }
            >
              <Textarea id="body" name="body" rows={22} defaultValue={initial.body} className="font-mono text-[15px]" />
            </Field>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card title="Visibility">
          <Checkbox name="is_published" defaultChecked={initial.is_published} label="Published" hint="Drafts can't be opened on the store, and footer links to them are hidden." />
        </Card>
        <SubmitButton size="lg" className="w-full" pending={pending} pendingText="Saving…">
          {initial.id ? "Save page" : "Create page"}
        </SubmitButton>
      </div>
    </form>
  );
}
