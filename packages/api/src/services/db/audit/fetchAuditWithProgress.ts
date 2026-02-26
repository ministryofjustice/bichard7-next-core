import type { AuditWithProgress } from "@moj-bichard7/common/types/Audit"
import type { User } from "@moj-bichard7/common/types/User"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { organisationUnitSql } from "../organisationUnitSql"

export const fetchAuditWithProgress = async (
  database: DatabaseConnection,
  auditId: number,
  user: User
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
      (
        SELECT COUNT(*)::int
        FROM
          br7own.audit_cases AS ac
          INNER JOIN br7own.error_list AS el ON el.error_id = ac.error_id
        WHERE
          ac.audit_id = ${auditId}
          AND (${organisationUnitSql(database, user)})
      ) AS total_cases,
      (
        SELECT COUNT(*)::int
        FROM
          br7own.audit_cases AS ac
          INNER JOIN br7own.error_list AS el ON el.error_id = ac.error_id
        WHERE
          ac.audit_id = ${auditId}
          AND (
            ((el.trigger_status = ${ResolutionStatusNumber.Unresolved}) OR el.trigger_status = ${ResolutionStatusNumber.Resolved} AND el.trigger_quality_checked > 1)
            AND ((el.error_status = ${ResolutionStatusNumber.Unresolved}) OR el.error_status = ${ResolutionStatusNumber.Resolved} AND el.error_quality_checked > 1)
          )
          AND (${organisationUnitSql(database, user)})
      ) AS audited_cases
    FROM 
      br7own.audits
    WHERE
      audit_id = ${auditId}
      AND created_by = ${user.username}
  `.catch((error: Error) => error)

  if (isError(results)) {
    return new Error("Failed to get audit record")
  }

  if (results.length === 0) {
    return null
  }

  return results[0]
}
