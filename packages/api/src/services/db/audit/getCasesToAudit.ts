import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export type CasesToAuditByUser = {
  caseIds: number[]
  username: string
}

export async function getCasesToAudit(
  database: WritableDatabaseConnection,
  createAudit: CreateAudit,
  user: User
): PromiseResult<CasesToAuditByUser[]> {
  /*
  [x] If included types has triggers then include cases with triggers.
    [ ] If specific trigger types have been included in the search criteria then filter these cases down further to only include cases that have one or more of these triggers.
  [x] If included types has exceptions then include cases with exceptions
  [x] Included types should be an OR filter not an AND - ticking both does not mean it needs both, just one or the other
  [x] Triggers or exceptions resolved by user (from loop)
  [x] Court should be visible by the user (sending the request)
  [x] Force should be visible by the user (sending the request)
   */
  const sql = database.connection

  const baseQuery = sql<{ error_id: number }[]>`
        SELECT 
          error_id
        FROM 
          br7own.error_list el
        WHERE
          court_code IN (${user.visibleCourts})
          AND org_for_police_filter IN (${user.visibleForces})
    `

  const resolvedByUsers = createAudit.resolvedByUsers ?? []
  const results = await Promise.all(
    resolvedByUsers.map(async (resolvedByUsername) => {
      let filter = sql``

      let triggerFilter = sql`trigger_resolved_by = ${resolvedByUsername}`
      if ((createAudit.triggerTypes?.length ?? 0) > 0) {
        triggerFilter = sql`(
            ${triggerFilter}
            AND (
              SELECT 
                COUNT(*)
              FROM 
                br7own.error_list_triggers elt
              WHERE 
                elt.error_id = el.error_id
                AND elt.trigger_code IN (${createAudit.triggerTypes as string[]})
            ) > 0 
        )`
      }

      const exceptionsFilter = sql`error_resolved_by = ${resolvedByUsername}`

      if (createAudit.includedTypes.includes("Triggers") && createAudit.includedTypes.includes("Exceptions")) {
        filter = sql`${filter} AND (${triggerFilter} OR ${exceptionsFilter})`
      } else if (createAudit.includedTypes.includes("Triggers")) {
        filter = sql`${filter} AND ${triggerFilter}`
      } else if (createAudit.includedTypes.includes("Exceptions")) {
        filter = sql`${filter} AND ${exceptionsFilter}`
      }

      const results = await sql<{ error_id: number }[]>`${baseQuery} ${filter}`.catch((error: Error) => error)
      if (isError(results)) {
        return new Error("Failed to get cases to audit")
      }

      return {
        caseIds: results.map((result) => result.error_id),
        username: resolvedByUsername
      }
    })
  )

  const error = results.find((result) => isError(result))
  if (error) {
    return error
  }

  return results as CasesToAuditByUser[]
}
