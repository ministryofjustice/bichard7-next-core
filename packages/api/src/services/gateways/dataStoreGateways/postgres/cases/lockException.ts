import type postgres from "postgres"

import { ResolutionStatus, resolutionStatusCodeByText } from "../../../../../useCases/dto/convertResolutionStatus"

export default async (sql: postgres.Sql, caseId: number, username: string, forceIds: number[]): Promise<void> => {
  const status = resolutionStatusCodeByText(ResolutionStatus.Unresolved) as number

  const result = await sql`
    UPDATE br7own.error_list el
      SET
      error_locked_by_id = ${username}
      WHERE
      error_locked_by_id IS NULL AND
        error_count > 0 AND
        error_status = ${status} AND
        error_id = ${caseId} AND
        br7own.force_code(el.org_for_police_filter) = ANY(${forceIds}::SMALLINT[])
      RETURNING 1
    `

  if (result.length < 1) {
    throw new Error("No rows were updated.")
  }

  return
}
