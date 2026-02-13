import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export const insertAuditCases = async (
  database: WritableDatabaseConnection,
  auditId: number,
  caseIds: number[]
): PromiseResult<{ audit_id: number; error_id: number }[]> => {
  const sql = database.connection

  const cases = caseIds.map((caseId) => ({ audit_id: auditId, error_id: caseId }))

  const result = await sql<{ audit_id: number; error_id: number }[]>`
    INSERT INTO br7own.audit_cases ${sql(cases, "audit_id", "error_id")}
    RETURNING *
  `

  return result
}
