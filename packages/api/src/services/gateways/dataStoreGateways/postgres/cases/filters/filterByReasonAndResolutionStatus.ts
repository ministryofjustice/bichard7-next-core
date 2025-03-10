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

const filterIfUnresolved = (sql: postgres.Sql, user: User, filters: Filters, resolutionStatus: number) => {
  const query = []

  if (shouldFilterForTriggers(user, filters.reason)) {
    query.push(sql`AND el.trigger_status = ${resolutionStatus}`)
  } else if (shouldFilterForExceptions(user, filters.reason)) {
    query.push(sql`AND el.error_status = ${resolutionStatus}`)
  } else if (canSeeTriggersAndException(user, filters.reason)) {
    if (filters.reasonCodes && reasonCodesAreExceptionsOnly(filters.reasonCodes)) {
      query.push(sql`AND el.error_status = ${resolutionStatus}`)
    } else if (filters.reasonCodes && reasonCodesAreTriggersOnly(filters.reasonCodes)) {
      query.push(sql`AND el.trigger_status = ${resolutionStatus}`)
    } else {
      query.push(sql`
        AND (el.error_status = ${resolutionStatus} OR el.trigger_status = ${resolutionStatus})
        AND (el.trigger_status = ${resolutionStatus} OR el.error_status = ${resolutionStatus})
      `)
    }
  }

  if (query.length === 0) {
    return sql`AND FALSE`
  }

  return query.map((q) => sql`${q}`)
}

const filterIfResolved = (sql: postgres.Sql, user: User, filters: Filters, resolutionStatus: number) => {
  const query = []

  if (shouldFilterForTriggers(user, filters.reason)) {
    query.push(sql`AND el.trigger_resolved_ts IS NOT NULL`)
  } else if (shouldFilterForExceptions(user, filters.reason)) {
    query.push(sql`AND el.error_status = ${resolutionStatus}`)
  } else if (canSeeTriggersAndException(user, filters.reason)) {
    if (filters.reasonCodes && reasonCodesAreExceptionsOnly(filters.reasonCodes)) {
      query.push(sql`AND el.error_status = ${resolutionStatus}`)
    } else if (filters.reasonCodes && reasonCodesAreTriggersOnly(filters.reasonCodes)) {
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

  if (resolutionStatus === ResolutionStatusNumber.Resolved) {
    return filterIfResolved(sql, user, filters, resolutionStatus)
  }

  return filterIfUnresolved(sql, user, filters, resolutionStatus)
}
