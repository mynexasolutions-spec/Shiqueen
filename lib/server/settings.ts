import "server-only";
import { sql } from "./db";
import { DEFAULT_SETTINGS, type StoreSettings } from "@/lib/settings-defaults";

export async function getSettings(): Promise<StoreSettings> {
  const rows = await sql<{ key: string; value: unknown }[]>`select key, value from settings`;
  const merged: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  for (const r of rows) if (r.key in DEFAULT_SETTINGS) merged[r.key] = r.value;
  return merged as unknown as StoreSettings;
}
