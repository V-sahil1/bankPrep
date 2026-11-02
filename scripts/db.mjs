// Runs a real, project-local PostgreSQL server (no admin rights, no Docker).
// Usage: npm run db   — data lives in .pgdata/, which is git-ignored.
// If you already run Postgres elsewhere, skip this and point DATABASE_URL at it.
import fs from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const databaseDir = path.resolve(".pgdata");
const port = Number(process.env.PGPORT ?? 5433);
const database = "bankprep";

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "bankprep",
  password: "bankprep",
  port,
  persistent: true,
  // Without this, initdb on Windows picks the system codepage (WIN1252), which rejects "₹".
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
});

const isFirstRun = !fs.existsSync(path.join(databaseDir, "PG_VERSION"));
if (isFirstRun) await pg.initialise();
await pg.start();

if (isFirstRun) await pg.createDatabase(database);
console.log(`PostgreSQL ready on localhost:${port} (database: ${database}). Ctrl+C to stop.`);

async function shutdown() {
  await pg.stop();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
