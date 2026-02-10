import type { CreateAudit } from "@moj-bichard7/common/contracts/CreateAudit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { addDays } from "date-fns"

import type { CasesToAuditByUser } from "../../../types/CasesToAuditByUser"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export async function getPotentialCasesToAudit(
  database: WritableDatabaseConnection,
  createAudit: CreateAudit,
  user: User
): PromiseResult<CasesToAuditByUser[]> {
  const sql = database.connection

  const baseQuery = sql`
    SELECT 
      error_id
    FROM 
      br7own.error_list el
    WHERE
      court_code = ANY (${user.visibleCourts})
      AND org_for_police_filter = ANY (${user.visibleForces})
    `

  let filter = sql``

  const resolvedByUsers = createAudit.resolvedByUsers ?? []

  let triggerFilter = sql`( 
    trigger_resolved_by = ANY (${resolvedByUsers})
    AND trigger_resolved_ts >= ${createAudit.fromDate}
    AND trigger_resolved_ts < ${addDays(createAudit.toDate, 1)}
  )`
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
          AND elt.trigger_code = ANY (${createAudit.triggerTypes as string[]})
      ) > 0 
    )`
  }

  const exceptionsFilter = sql`(
    error_resolved_by = ANY (${resolvedByUsers})
    AND error_resolved_ts >= ${createAudit.fromDate}
    AND error_resolved_ts < ${addDays(createAudit.toDate, 1)}
  )`

  if (createAudit.includedTypes.includes("Triggers") && createAudit.includedTypes.includes("Exceptions")) {
    filter = sql`${filter} AND (${triggerFilter} OR ${exceptionsFilter})`
  } else if (createAudit.includedTypes.includes("Triggers")) {
    filter = sql`${filter} AND ${triggerFilter}`
  } else if (createAudit.includedTypes.includes("Exceptions")) {
    filter = sql`${filter} AND ${exceptionsFilter}`
  }

  const results = await Promise.all(
    resolvedByUsers.map(async (resolvedByUsername) => {
      const results = await sql<{ error_id: number }[]>`${baseQuery} ${filter}`.catch((error: Error) => error)
      if (isError(results)) {
        return new Error("Failed to get cases to audit")
      }

      return {
        caseIds: results.map((result) => result.error_id).sort((a, b) => a - b),
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
