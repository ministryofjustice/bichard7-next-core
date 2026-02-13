import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export const insertAuditCases = async (
  database: WritableDatabaseConnection,
  auditId: number,
  caseIds: number[]
): PromiseResult<{ audit_id: number; error_id: number }[]> => {
  if (caseIds.length === 0) {
    return []
  }

  const sql = database.connection

  const cases = caseIds.map((caseId) => ({ audit_id: auditId, error_id: caseId }))

  return await sql<{ audit_id: number; error_id: number }[]>`
    INSERT INTO br7own.audit_cases
    SELECT * FROM UNNEST(
      ${cases.map((c) => c.audit_id)}::int[],
      ${cases.map((c) => c.error_id)}::int[]
    )
    RETURNING *
  `.catch((err: Error) => err)
}
