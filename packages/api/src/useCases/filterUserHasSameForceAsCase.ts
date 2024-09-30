import postgresFactory from "../services/db/postgresFactory"

export default async (username: string, caseId: number, forceIds: number[]): Promise<number> => {
  const sql = postgresFactory()

  const [row] = await sql`
      SELECT
        COUNT(*)
      FROM
        br7own.users u
        JOIN br7own.error_list el ON u.username = el.error_locked_by_id
      WHERE
        el.error_id = ${caseId}
        AND el.error_locked_by_id = ${username}
        AND br7own.force_code(org_for_police_filter) IN (${forceIds.toString()})
    `

  const count = row.count

  if (count !== 1) {
    throw new Error(`User ${username} does not exist`)
  }

  return count
}
