import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { Filters } from "../../../../../../types/CaseIndexQuerystring"

import {
  resolutionStatusCodeByText,
  ResolutionStatusNumber
} from "../../../../../../useCases/dto/convertResolutionStatus"
import {
  canSeeTriggersAndException,
  reasonCodesAreExceptionsOnly,
  reasonCodesAreTriggersOnly,
  reasonFilterOnlyIncludesExceptions,
  reasonFilterOnlyIncludesTriggers,
  shouldFilterForExceptions,
  shouldFilterForTriggers
} from "./checkPermissions"

const filterIfUnresolved = (
  sql: postgres.Sql,
  user: User,
  filters: Filters,
  reasonCodes: string[]
): postgres.PendingQuery<postgres.Row[]> | postgres.PendingQuery<postgres.Row[]>[] => {
  const query = []

  if (shouldFilterForTriggers(user, filters.reason)) {
    query.push(sql`AND el.trigger_status = ${ResolutionStatusNumber.Unresolved}`)
  } else if (shouldFilterForExceptions(user, filters.reason)) {
    query.push(sql`AND el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted})`)
  } else if (canSeeTriggersAndException(user, filters.reason)) {
    if (reasonCodesAreExceptionsOnly(reasonCodes)) {
      query.push(
        sql`AND el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted})`
      )
    } else if (reasonCodesAreTriggersOnly(reasonCodes)) {
      query.push(sql`AND el.trigger_status = ${ResolutionStatusNumber.Unresolved}`)
    } else {
      query.push(sql`
        AND (el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted}) OR el.trigger_status = ${ResolutionStatusNumber.Unresolved})
        AND (el.trigger_status = ${ResolutionStatusNumber.Unresolved} OR el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted}))
      `)
    }
  }

  if (query.length === 0) {
    return sql`AND FALSE`
  }

  return query.map((q) => sql`${q}`)
}

const filterIfResolved = (
  sql: postgres.Sql,
  user: User,
  filters: Filters,
  resolutionStatus: number,
  reasonCodes: string[]
): postgres.PendingQuery<postgres.Row[]> | postgres.PendingQuery<postgres.Row[]>[] => {
  const query = []

  if (shouldFilterForTriggers(user, filters.reason)) {
    query.push(sql`AND el.trigger_resolved_ts IS NOT NULL`)
  } else if (shouldFilterForExceptions(user, filters.reason)) {
    query.push(sql`AND el.error_status = ${resolutionStatus}`)
  } else if (canSeeTriggersAndException(user, filters.reason)) {
    if (reasonCodesAreExceptionsOnly(reasonCodes)) {
      query.push(sql`AND el.error_status = ${resolutionStatus}`)
    } else if (reasonCodesAreTriggersOnly(reasonCodes)) {
      query.push(sql`AND el.trigger_resolved_ts IS NOT NULL`)
    } else {
      query.push(
        sql`
          AND (
            el.error_resolved_ts IS NOT NULL
            OR el.error_status = ${resolutionStatus}
            OR el.trigger_resolved_ts IS NOT NULL
          )
        `
      )
    }
  }

  if (filters.resolvedByUsername || !userAccess(user)[Permission.ListAllCases]) {
    const username = filters.resolvedByUsername ?? user.username

    if (reasonFilterOnlyIncludesTriggers(filters.reason)) {
      query.push(sql`AND el.trigger_resolved_by = ${username}`)
    } else if (reasonFilterOnlyIncludesExceptions(filters.reason)) {
      query.push(sql`AND el.error_resolved_by = ${username}`)
    } else {
      query.push(
        sql`
          AND (
            el.error_resolved_by = ${username}
            OR el.trigger_resolved_by = ${username}
            OR elt.resolved_by = ${username}
          )
        `
      )
    }
  }

  if (query.length === 0) {
    return sql`AND FALSE`
  }

  return query.map((q) => sql`${q}`)
}

export const filterByReasonAndResolutionStatus = (
  sql: postgres.Sql,
  user: User,
  filters: Filters
): postgres.PendingQuery<Row[]> | postgres.PendingQuery<Row[]>[] => {
  const resolutionStatus = filters.caseState
    ? (resolutionStatusCodeByText(filters.caseState) ?? ResolutionStatusNumber.Unresolved)
    : ResolutionStatusNumber.Unresolved

  let reasonCodes: string[] = []

  if (filters.reasonCodes) {
    reasonCodes = Array.isArray(filters.reasonCodes) ? filters.reasonCodes : [filters.reasonCodes]
  }

  if (resolutionStatus === ResolutionStatusNumber.Resolved) {
    return filterIfResolved(sql, user, filters, resolutionStatus, reasonCodes)
  }

  return filterIfUnresolved(sql, user, filters, reasonCodes)
}
