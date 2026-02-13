import type { CreateAudit } from "@moj-bichard7/common/contracts/CreateAudit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { addDays } from "date-fns"

import type { CasesToAuditByUser } from "../../../types/CasesToAuditByUser"
import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

export async function getPotentialCasesToAudit(
  database: WritableDatabaseConnection,
  { fromDate, includedTypes, resolvedByUsers, toDate, triggerTypes }: CreateAudit,
  user: User
): PromiseResult<CasesToAuditByUser[]> {
  const checkForResolvedTriggers = includedTypes.includes("Triggers")
  const checkForResolvedExceptions = includedTypes.includes("Exceptions")

  const sql = database.connection

  const baseQuery = sql`
    SELECT 
      error_id,
      trigger_resolved_by,
      trigger_quality_checked,
      error_resolved_by,
      error_quality_checked
    FROM 
      br7own.error_list el
    WHERE
      court_code = ANY (${user.visibleCourts})
      AND org_for_police_filter = ANY (${user.visibleForces})
    `

  let filter = sql``

  let triggerFilter = sql`( 
    trigger_resolved_by = ANY (${resolvedByUsers})
    AND trigger_resolved_ts >= ${fromDate}
    AND trigger_resolved_ts < ${addDays(toDate, 1)}
  )`
  if ((triggerTypes?.length ?? 0) > 0) {
    triggerFilter = sql`(
      ${triggerFilter}
      AND (
        SELECT 
          COUNT(*)
        FROM 
          br7own.error_list_triggers elt
        WHERE 
          elt.error_id = el.error_id
          AND elt.trigger_code = ANY (${triggerTypes as string[]})
      ) > 0 
    )`
  }

  const exceptionsFilter = sql`(
    error_resolved_by = ANY (${resolvedByUsers})
    AND error_resolved_ts >= ${fromDate}
    AND error_resolved_ts < ${addDays(toDate, 1)}
  )`

  if (checkForResolvedTriggers && checkForResolvedExceptions) {
    filter = sql`${filter} AND (${triggerFilter} OR ${exceptionsFilter})`
  } else if (checkForResolvedTriggers) {
    filter = sql`${filter} AND ${triggerFilter}`
  } else if (checkForResolvedExceptions) {
    filter = sql`${filter} AND ${exceptionsFilter}`
  }

  const results = await sql<
    {
      error_id: number
      error_quality_checked: null | number
      error_resolved_by: null | string
      trigger_quality_checked: null | number
      trigger_resolved_by: null | string
    }[]
  >`${baseQuery} ${filter}`.catch((error: Error) => error)
  if (isError(results)) {
    return new Error("Failed to get cases to audit")
  }

  return resolvedByUsers.map((resolvedByUsername) => {
    return {
      cases: results
        .filter((result) => {
          return (
            (checkForResolvedTriggers && result.trigger_resolved_by == resolvedByUsername) ||
            (checkForResolvedExceptions && result.error_resolved_by == resolvedByUsername)
          )
        })
        .map((result) => {
          let audited = false
          const triggersNeedAudit =
            (result.trigger_resolved_by?.length ?? 0) > 0 && (result.trigger_quality_checked ?? 1) <= 1
          const exceptionsNeedAudit =
            (result.error_resolved_by?.length ?? 0) > 0 && (result.error_quality_checked ?? 1) <= 1
          if (checkForResolvedTriggers && checkForResolvedExceptions) {
            audited = !triggersNeedAudit && !exceptionsNeedAudit
          } else if (checkForResolvedTriggers) {
            audited = !triggersNeedAudit
          } else if (checkForResolvedExceptions) {
            audited = !exceptionsNeedAudit
          }

          return { audited, id: result.error_id }
        }),
      username: resolvedByUsername
    }
  })
}
