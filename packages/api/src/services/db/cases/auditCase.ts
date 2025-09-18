import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

type AuditQuality = {
  errorQuality?: number
  triggerQuality?: number
}

export default async (
  database: WritableDatabaseConnection,
  caseId: number,
  { errorQuality, triggerQuality }: AuditQuality
): PromiseResult<boolean> => {
  const sql = database.connection
  const updates = []

  if (errorQuality !== undefined) {
    updates.push(sql`error_quality_checked = ${errorQuality}`)
  }

  if (triggerQuality !== undefined) {
    updates.push(sql`trigger_quality_checked = ${triggerQuality}`)
  }

  if (updates.length === 0) {
    return Error("Neither errorQuality nor triggerQuality is provided")
  }

  const setClause = updates.reduce((acc, fragment, i) => (i === 0 ? fragment : sql`${acc}, ${fragment}`), sql``)

  const result = await database.connection`
    UPDATE br7own.error_list el
      SET
        ${setClause}
      WHERE
        error_id = ${caseId}
  `.catch((error: Error) => error)

  if (isError(result)) {
    return Error(`Couldn't update audit quality for case id ${caseId}: ${result.message}`)
  }

  return result.count > 0
}
