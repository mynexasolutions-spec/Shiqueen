import "server-only";
import postgres from "postgres";

// One pooled client per server instance (reused across hot reloads in dev).
// `prepare: false` keeps it compatible with Supabase's transaction pooler too.
const globalForDb = globalThis as unknown as { __shiqueenSql?: postgres.Sql };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  // `next build` prerenders with several workers at once; keep each to one connection so
  // Supabase's pooler isn't exhausted. At runtime a small pool is plenty for this store.
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  return postgres(url, {
    prepare: false,
    max: Number(process.env.DATABASE_POOL_MAX ?? (isBuild ? 1 : 4)),
    idle_timeout: isBuild ? 5 : 20,
    connect_timeout: 30,
    onnotice: () => {},
  });
}

export const sql: postgres.Sql = globalForDb.__shiqueenSql ?? createClient();
if (process.env.NODE_ENV !== "production") globalForDb.__shiqueenSql = sql;
