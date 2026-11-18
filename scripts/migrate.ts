// Applies db/schema.sql to the database in DATABASE_URL.
// Usage: npm run db:migrate
import { readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
  try {
    const schema = await readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8");
    await sql.unsafe(schema);
    console.log("✔ Schema applied");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
