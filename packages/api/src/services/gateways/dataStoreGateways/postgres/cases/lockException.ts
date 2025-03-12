import type postgres from "postgres"

import { ResolutionStatus, resolutionStatusCodeByText } from "../../../../../useCases/dto/convertResolutionStatus"

export default async (
  sql: postgres.Sql,
  caseId: number,
  username: string,
  organisationUnitSql: postgres.PendingQuery<postgres.Row[]>
): Promise<boolean> => {
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
        (${organisationUnitSql})
    `

  return result.count > 0
}
