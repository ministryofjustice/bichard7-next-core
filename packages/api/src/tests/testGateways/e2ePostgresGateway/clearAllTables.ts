import type postgres from "postgres"

export default async (sql: postgres.Sql): Promise<boolean> => {
  await sql`
    TRUNCATE br7own.users, br7own.error_list RESTART IDENTITY CASCADE;
  `

  return true
}
