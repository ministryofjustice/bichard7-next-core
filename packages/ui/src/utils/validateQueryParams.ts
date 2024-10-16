import type { ParsedUrlQuery } from "querystring"
import type User from "services/entities/User"
import type { QueryOrder, CaseListQueryParams, CaseState } from "types/CaseListQueryParams"
import { Reason, LockedState } from "types/CaseListQueryParams"
import Permission from "types/Permission"
import caseStateFilters from "./caseStateFilters"
import dedupeTriggerCodes from "./dedupeTriggerCodes"
import { reasonOptions } from "./reasonOptions"
import { mapCaseAges } from "./validators/validateCaseAges"
import { validateDateRange } from "./validators/validateDateRange"
import { validateQueryParams } from "./validators/validateQueryParams"
import defaults from "defaults"

export const validateOrder = (param: unknown): param is QueryOrder => param === "asc" || param === "desc"

// Remove characters that have an impact on queries.
export const sanitise = (value: string) => value.replace(/[\\%_^]/g, "")

export const extractSearchParamsFromQuery = (query: ParsedUrlQuery, currentUser: User): CaseListQueryParams => {
  // TODO: Actual validation of content with zod
  const reason =
    query.reason && validateQueryParams(query.reason) && reasonOptions.includes(query.reason as Reason)
      ? (query.reason as Reason)
      : Reason.All
  const caseAges = mapCaseAges(query.caseAge)
  const dateRange = validateDateRange({
    from: query.from,
    to: query.to
  })
  const defendantName = validateQueryParams(query.defendantName) ? sanitise(query.defendantName) : null
  const courtName = validateQueryParams(query.courtName) ? sanitise(query.courtName) : undefined
  const reasonCodes = validateQueryParams(query.reasonCodes)
    ? dedupeTriggerCodes(query.reasonCodes.split(" ").filter((reasonCode) => reasonCode !== "")).map((reasonCode) =>
        sanitise(reasonCode)
      )
    : []
  const ptiurn = validateQueryParams(query.ptiurn) ? sanitise(query.ptiurn) : undefined
  const lockedState: LockedState = validateQueryParams(query.lockedState)
    ? (query.lockedState as LockedState)
    : LockedState.All
  const allocatedToUserName = lockedState === LockedState.LockedToMe ? currentUser.username : null
  const caseState = caseStateFilters.includes(String(query.state)) ? (query.state as CaseState) : null
  const resolvedByUsername =
    caseState === "Resolved" && !currentUser.hasAccessTo[Permission.ListAllCases] ? currentUser.username : null
  const courtDateRange = caseAges || dateRange
  const resolvedDateRange = validateDateRange({ from: query.resolvedFrom, to: query.resolvedTo })
  const asn = validateQueryParams(query.asn) ? sanitise(query.asn) : null

  return {
    ...(defendantName && { defendantName: defendantName }),
    ...(courtName && { courtName: courtName }),
    ...(reasonCodes && { reasonCodes: reasonCodes }),
    ...(ptiurn && { ptiurn }),
    ...(asn && { asn }),
    reason,
    maxPageItems: validateQueryParams(query.maxPageItems) ? +Number(query.maxPageItems) : defaults.maxPageItems,
    page: validateQueryParams(query.page) ? +Number(query.page) : 1,
    orderBy: validateQueryParams(query.orderBy) ? query.orderBy : "courtDate",
    order: validateOrder(query.order) && query.order == "asc" ? "asc" : "desc",
    ...(courtDateRange && { courtDateRange }),
    lockedState,
    ...(caseState && { caseState }),
    ...(resolvedByUsername && { resolvedByUsername }),
    ...(allocatedToUserName && { allocatedToUserName }),
    ...(resolvedDateRange && { resolvedDateRange })
  }
}
