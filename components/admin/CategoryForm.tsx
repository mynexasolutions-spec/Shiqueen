"use client";

import { useActionState, useState } from "react";
import { Alert, Checkbox, Field, Input, Select, SubmitButton, Textarea } from "@/components/ui/form";
import { Card } from "@/components/admin/ui";
import { SingleImageUpload } from "@/components/admin/ImageUpload";
import { saveCategoryAction } from "@/app/admin/_actions/categories";
import { slugify } from "@/lib/format";

export interface CategoryFormValues {
  id?: string;
  name: string;
  slug: string;
  parent_id: string | null;
  tagline: string;
  description: string;
  badge: string;
  image_url: string;
  image_file_id: string;
  sort_order: number;
  is_active: boolean;
  show_on_home: boolean;
}

export default function CategoryForm({
  initial,
  parentOptions,
}: {
  initial: CategoryFormValues;
  parentOptions: { id: string; label: string }[];
}) {
  const [state, action, pending] = useActionState(saveCategoryAction, {});
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [parentId, setParentId] = useState(initial.parent_id ?? "");

  return (
    <form action={action} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="space-y-6 xl:col-span-2">
        {state.error && <Alert tone="error">{state.error}</Alert>}
        {state.message && <Alert tone="success">{state.message}</Alert>}

        <Card title="Details">
          <div className="space-y-5">
            <Field label="Category name" htmlFor="name" required>
              <Input
                id="name"
                name="name"
                required
                maxLength={120}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugTouched) setSlug(slugify(e.target.value));
                }}
              />
            </Field>
            <Field label="URL slug" htmlFor="slug" hint={<>Shown in the web address: shiqueen.in/collections/<strong>{slug || "your-slug"}</strong></>}>
              <Input
                id="slug"
                name="slug"
                maxLength={120}
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
              />
            </Field>
            <Field label="Parent category" htmlFor="parent_id" hint="Leave as “None” for a main category. Sub-categories can be nested as deep as you like.">
              <Select id="parent_id" name="parent_id" value={parentId} onChange={(e) => setParentId(e.target.value)}>
                <option value="">None — this is a main category</option>
                {parentOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Short tagline" htmlFor="tagline" hint="Shown under the name on the homepage tiles, e.g. “Layered & Pendants”.">
              <Input id="tagline" name="tagline" maxLength={200} defaultValue={initial.tagline} />
            </Field>
            <Field label="Description" htmlFor="description" hint="Shown at the top of the category page.">
              <Textarea id="description" name="description" rows={4} maxLength={2000} defaultValue={initial.description} />
            </Field>
            <Field label="Badge text" htmlFor="badge" hint="Optional highlight, e.g. “Long-Lasting Anti-Tarnish”.">
              <Input id="badge" name="badge" maxLength={60} defaultValue={initial.badge} />
            </Field>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Category image" description="Required. Used on tiles and the category banner.">
          <SingleImageUpload
            name="image"
            folder="/shiqueen/categories"
            required
            initial={initial.image_url ? { url: initial.image_url, fileId: initial.image_file_id } : null}
          />
        </Card>

        <Card title="Visibility">
          <div className="space-y-3">
            <Checkbox name="is_active" defaultChecked={initial.is_active} label="Visible on the store" hint="Hidden categories (and everything inside them) disappear from the shop." />
            <Checkbox
              name="show_on_home"
              defaultChecked={initial.show_on_home}
              label="Show on homepage"
              hint="Applies to main categories in the “Shop by Category” grid."
            />
            <Field label="Sort order" htmlFor="sort_order" hint="Lower numbers appear first.">
              <Input id="sort_order" name="sort_order" type="number" min={-9999} max={9999} defaultValue={initial.sort_order} />
            </Field>
          </div>
        </Card>

        <SubmitButton size="lg" className="w-full" pending={pending} pendingText="Saving…">
          {initial.id ? "Save changes" : "Create category"}
        </SubmitButton>
      </div>
    </form>
  );
}
