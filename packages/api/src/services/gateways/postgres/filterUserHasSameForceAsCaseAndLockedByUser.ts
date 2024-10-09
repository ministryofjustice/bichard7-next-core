import type postgres from "postgres"

interface Result {
  locked_by_user: boolean
  case_in_force: boolean
}

export default async (sql: postgres.Sql, username: string, caseId: number, forceIds: number[]): Promise<boolean> => {
  const [result]: [Result?] = await sql`
      SELECT
        (el.error_locked_by_id = ${username})::integer as locked_by_user,
        (br7own.force_code(el.org_for_police_filter) = ANY((${forceIds}::smallint[])))::integer as case_in_force
      FROM br7own.error_list el
      WHERE
        el.error_id = ${caseId}
    `

  if (!result) {
    throw new Error("Case not found")
  }

  return result.locked_by_user && result.case_in_force
}
