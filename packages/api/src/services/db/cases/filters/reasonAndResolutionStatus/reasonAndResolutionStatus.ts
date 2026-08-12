import type { Reason } from "@moj-bichard7/common/types/ApiCaseQuery"
import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import type { Row } from "postgres"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

import type { Filters } from "../../../../../types/CaseIndexQuerystring"
import type { DatabaseConnection } from "../../../../../types/DatabaseGateway"

import { resolutionStatusCodeByText } from "../../../../../useCases/dto/convertResolutionStatus"
import {
  canSeeTriggersAndExceptions,
  reasonCodesAreExceptionsOnly,
  reasonCodesAreTriggersOnly,
  reasonFilterOnlyIncludesExceptions,
  reasonFilterOnlyIncludesTriggers,
  shouldFilterForExceptions,
  shouldFilterForTriggers
} from "../checkPermissions"

type FilterTarget = "BOTH" | "EXCEPTIONS" | "NONE" | "TRIGGERS"

const getFilterTarget = (user: User, reason: Reason, reasonCodes: string[]): FilterTarget => {
  if (shouldFilterForTriggers(user, reason)) {
    return "TRIGGERS"
  }

  if (shouldFilterForExceptions(user, reason)) {
    return "EXCEPTIONS"
  }

  if (canSeeTriggersAndExceptions(user, reason)) {
    if (reasonCodesAreExceptionsOnly(reasonCodes)) {
      return "EXCEPTIONS"
    }

    if (reasonCodesAreTriggersOnly(reasonCodes)) {
      return "TRIGGERS"
    }

    return "BOTH"
  }

  return "NONE"
}

const filterIfUnresolved = (
  database: DatabaseConnection,
  user: User,
  filters: Filters,
  reasonCodes: string[]
): postgres.PendingQuery<postgres.Row[]> | postgres.PendingQuery<postgres.Row[]>[] => {
  const target = getFilterTarget(user, filters.reason, reasonCodes)

  if (target === "TRIGGERS") {
    return database.connection`AND el.trigger_status = ${ResolutionStatusNumber.Unresolved}`
  } else if (target === "EXCEPTIONS") {
    return database.connection`AND el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted})`
  } else if (target === "BOTH") {
    return database.connection`
        AND (el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted}) OR el.trigger_status = ${ResolutionStatusNumber.Unresolved})
        AND (el.trigger_status = ${ResolutionStatusNumber.Unresolved} OR el.error_status IN (${ResolutionStatusNumber.Unresolved}, ${ResolutionStatusNumber.Submitted}))
      `
  }

  return database.connection`AND FALSE`
}

const filterIfResolved = (
  database: DatabaseConnection,
  user: User,
  filters: Filters,
  resolutionStatus: number,
  reasonCodes: string[]
): postgres.PendingQuery<postgres.Row[]> | postgres.PendingQuery<postgres.Row[]>[] => {
  const query = []
  const target = getFilterTarget(user, filters.reason, reasonCodes)

  if (target === "TRIGGERS") {
    query.push(database.connection`AND el.trigger_resolved_ts IS NOT NULL`)
  } else if (target === "EXCEPTIONS") {
    query.push(database.connection`AND el.error_status = ${resolutionStatus}`)
  } else if (target === "BOTH") {
    query.push(
      database.connection`
          AND (
            el.error_resolved_ts IS NOT NULL
            OR el.error_status = ${resolutionStatus}
            OR el.trigger_resolved_ts IS NOT NULL
          )
        `
    )
  }

  if (filters.resolvedByUsername) {
    const username = filters.resolvedByUsername ?? user.username

    if (reasonFilterOnlyIncludesTriggers(filters.reason)) {
      query.push(database.connection`AND el.trigger_resolved_by = ${username}`)
    } else if (reasonFilterOnlyIncludesExceptions(filters.reason)) {
      query.push(database.connection`AND el.error_resolved_by = ${username}`)
    } else {
      query.push(
        database.connection`
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
    return database.connection`AND FALSE`
  }

  return query.map((q) => database.connection`${q}`)
}

export const filterByReasonAndResolutionStatus = (
  database: DatabaseConnection,
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
    return filterIfResolved(database, user, filters, resolutionStatus, reasonCodes)
  }

  return filterIfUnresolved(database, user, filters, reasonCodes)
}
