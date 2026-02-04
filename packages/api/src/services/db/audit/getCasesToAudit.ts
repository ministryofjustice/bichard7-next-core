import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export type CasesToAuditByUser = {
  caseIds: number[]
  username: string
}

export async function getCasesToAudit(
  database: WritableDatabaseConnection,
  createAudit: CreateAudit
): PromiseResult<CasesToAuditByUser[]> {
  /*
  If included types has triggers then include cases with triggers. If specific trigger types have been included in the search criteria then filter these cases down further to only include cases that have one or more of these triggers.
If included types has exceptions then include cases with exceptions
Included types should be an OR filter not an AND - ticking both does not mean it needs both, just one or the other
Triggers or exceptions resolved by user (from loop)
Court should be visible by the user (sending the request)
Force should be visible by the user (sending the request)
   */
  const sql = database.connection

  const baseQuery = sql<{ error_id: number }[]>`
        SELECT 
          error_id
        FROM 
          br7own.error_list
    `

  let filter = sql``
  if (createAudit.includedTypes.includes("Triggers") && createAudit.includedTypes.includes("Exceptions")) {
    filter = sql`${filter} (trigger_resolved_by = 'user1' OR error_resolved_by = 'user1')`
  } else if (createAudit.includedTypes.includes("Triggers")) {
    filter = sql`${filter} trigger_resolved_by = 'user1'`
  } else if (createAudit.includedTypes.includes("Exceptions")) {
    filter = sql`${filter} error_resolved_by = 'user1'`
  }

  const results = await sql<{ error_id: number }[]>`${baseQuery} WHERE ${filter}`.catch((error: Error) => error)
  if (isError(results)) {
    return new Error("Failed to get cases to audit")
  }

  const caseIds = results.map((row) => row.error_id)
  return [
    {
      caseIds,
      username: "user1"
    }
  ]
  // const caseIds = await Promise.all(
  //   (createAudit.resolvedByUsers ?? []).map(async (username) => {
  //     const results = await sql<{ caseId: number }>`
  //       SELECT error_id AS caseId
  //       FROM br7own.error_list
  //   `
  //   })
  // )
}
