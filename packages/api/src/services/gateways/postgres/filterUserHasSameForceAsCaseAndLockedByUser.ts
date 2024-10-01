import type postgres from "postgres"

export default async (sql: postgres.Sql, username: string, caseId: number, forceIds: number[]): Promise<number> => {
  const [row] = await sql`
      SELECT
        COUNT(*)
      FROM
        br7own.users u
        JOIN br7own.error_list el ON u.username = el.error_locked_by_id
      WHERE
        el.error_id = ${caseId}
        AND el.error_locked_by_id = ${username}
        AND br7own.force_code(el.org_for_police_filter) IN (${forceIds.toString()})
    `

  const count = row.count

  if (count !== 1) {
    throw new Error(`Case is either: not present; not in the force or not locked by ${username}`)
  }

  return count
}
