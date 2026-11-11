#!/usr/bin/env -S npx tsx
/**
 * Back up Postgres row(s) as a JSON file.
 *
 * Setup:
 *   npm install pg
 *   npm install -D typescript tsx @types/pg @types/node
 *
 * Usage:
 *   npx tsx backup-pg-rows.ts <table> <where-condition> <output-file>
 *
 * Examples:
 *   npx tsx backup-pg-rows.ts public.orders "id = 42"
 *   npx tsx backup-pg-rows.ts users "email = 'a@b.com'" users_backup.json
 *
 * Connection: uses DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASSWORD
 *
 * The JSON document is built by Postgres itself (to_jsonb) and is never
 * parsed in JavaScript, so large bigint/numeric values keep their precision.
 */

import fs from "node:fs"
import { Client } from "pg"

async function main(): Promise<void> {
  const [table, where, outArg] = process.argv.slice(2)

  if (!table || !where || !outArg) {
    console.error("Usage: npx tsx backup-pg-rows.ts <table> <where-condition> <output-file>")
    process.exit(1)
  }

  const client = new Client({
    host: process.env.DB_HOST ?? "10.110.5.10",
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  })
  await client.connect()

  try {
    // Resolve and safely quote the table name (also validates that it exists).
    const { rows: t } = await client.query<{ tbl: string }>("SELECT $1::text::regclass::text AS tbl", [table])
    const tbl = t[0].tbl

    const { rows } = await client.query<{ n: number; doc: string }>({
      text: `SELECT count(*)::int AS n,
                    jsonb_pretty(jsonb_build_object(
                      'table',        $1::text,
                      'where',        $2::text,
                      'backed_up_at', now(),
                      'rows',         coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb)
                    )) AS doc
             FROM ${tbl} r
             WHERE ${where}`,
      values: [tbl, where]
    })

    const { n, doc } = rows[0]
    if (n === 0) {
      console.error("Error: condition matched no rows. Nothing written.")
      process.exitCode = 1
      return
    }

    const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14)
    fs.writeFileSync(outArg, doc + "\n")

    console.log(`Backed up ${n} row(s) from ${tbl} to: ${outArg}`)
  } finally {
    await client.end()
  }
}

main().catch((err: unknown) => {
  console.error("Error:", err instanceof Error ? err.message : err)
  process.exit(1)
})
