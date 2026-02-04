import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export async function getCasesToAudit(
  database: WritableDatabaseConnection,
  createAudit: CreateAudit
): PromiseResult<number[]> {
  /*
  If included types has triggers then include cases with triggers. If specific trigger types have been included in the search criteria then filter these cases down further to only include cases that have one or more of these triggers.
If included types has exceptions then include cases with exceptions
Included types should be an OR filter not an AND - ticking both does not mean it needs both, just one or the other
Triggers or exceptions resolved by user (from loop)
Court should be visible by the user (sending the request)
Force should be visible by the user (sending the request)
   */
  const sql = database.connection
  const results = await sql<{ error_id: number }[]>`
        SELECT error_id
        FROM br7own.error_list
    `.catch((error: Error) => error)
  if (isError(results)) {
    return new Error("Failed to get cases to audit")
  }

  return results.map((row) => row.error_id)
  // const caseIds = await Promise.all(
  //   (createAudit.resolvedByUsers ?? []).map(async (username) => {
  //     const results = await sql<{ caseId: number }>`
  //       SELECT error_id AS caseId
  //       FROM br7own.error_list
  //   `
  //   })
  // )
}
