import type postgres from "postgres"

export interface CanCaseBeResubmittedResult {
  case_in_force: boolean
  case_is_submitted: boolean
  case_is_unresolved: boolean
  locked_by_user: boolean
}

export default async (sql: postgres.Sql, username: string, caseId: number, forceIds: number[]): Promise<boolean> => {
  const [result]: [CanCaseBeResubmittedResult?] = await sql`
      SELECT
        (el.error_locked_by_id = ${username})::INTEGER as locked_by_user,
        (br7own.force_code(el.org_for_police_filter) = ANY((${forceIds}::SMALLINT[])))::INTEGER as case_in_force,
        (el.resolution_ts IS NULL)::INTEGER as case_is_unresolved,
        (el.error_status = 3)::INTEGER as case_is_submitted
      FROM br7own.error_list el
      WHERE
        el.error_id = ${caseId}
    `

  if (!result) {
    throw new Error("Case not found")
  }

  return result.locked_by_user && result.case_in_force && result.case_is_unresolved && !result.case_is_submitted
}
