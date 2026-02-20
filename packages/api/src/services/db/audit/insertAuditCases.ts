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

  return await database.connection<{ audit_id: number; error_id: number }[]>`
    INSERT INTO br7own.audit_cases (audit_id, error_id) 
    SELECT ${auditId}, error_id
    FROM UNNEST(${caseIds}::int[]) AS t(error_id)
    RETURNING *
  `.catch((err: Error) => err)
}
