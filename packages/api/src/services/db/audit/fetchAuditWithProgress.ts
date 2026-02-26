import type { AuditWithProgress } from "@moj-bichard7/common/types/Audit"
import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

export const fetchAuditWithProgress = async (
  database: DatabaseConnection,
  auditId: number,
  { username }: User
): PromiseResult<AuditWithProgress | null> => {
  const sql = database.connection

  const results = await sql<AuditWithProgress[]>`
      SELECT
        audit_id,
        created_by,
        created_when,
        completed_when,
        from_date,
        to_date,
        included_types,
        resolved_by_users,
        trigger_types,
        volume_of_cases,
        0 AS total_cases,
        0 AS audited_cases
      FROM 
        br7own.audits
      WHERE
        audit_id = ${auditId}
        AND created_by = ${username}
    `.catch((error: Error) => error)

  if (isError(results)) {
    return new Error("Failed to get audit record")
  }

  if (results.length === 0) {
    return null
  }

  return results[0]
}
