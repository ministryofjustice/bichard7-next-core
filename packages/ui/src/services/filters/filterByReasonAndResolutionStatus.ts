import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { every } from "lodash"
import type CourtCase from "services/entities/CourtCase"
import type User from "services/entities/User"
import type { SelectQueryBuilder } from "typeorm"
import { Brackets, IsNull, Not } from "typeorm"
import type { CaseState } from "types/CaseListQueryParams"
import { Reason } from "types/CaseListQueryParams"
import Permission from "@moj-bichard7/common/types/Permission"

const reasonFilterOnlyIncludesTriggers = (reason?: Reason): boolean => reason === Reason.Triggers

const reasonFilterOnlyIncludesExceptions = (reason?: Reason): boolean => reason === Reason.Exceptions

const reasonCodesAreExceptionsOnly = (reasonCodes: string[] | undefined): boolean => {
  if (!reasonCodes || reasonCodes.length === 0) {
    return false
  }

  return every(reasonCodes, (rc: string) => ExceptionCode[rc as keyof typeof ExceptionCode])
}

const reasonCodesAreTriggersOnly = (reasonCodes: string[] | undefined): boolean => {
  if (!reasonCodes || reasonCodes.length === 0) {
    return false
  }

  return every(reasonCodes, (rc: string) => TriggerCode[rc as keyof typeof TriggerCode])
}

const shouldFilterForExceptions = (user: User, reason?: Reason): boolean =>
  user.hasAccessTo[Permission.Exceptions] &&
  ((!user.hasAccessTo[Permission.Triggers] && !reasonFilterOnlyIncludesTriggers(reason)) ||
    reasonFilterOnlyIncludesExceptions(reason))

const shouldFilterForTriggers = (user: User, reason?: Reason): boolean =>
  user.hasAccessTo[Permission.Triggers] &&
  ((!user.hasAccessTo[Permission.Exceptions] && !reasonFilterOnlyIncludesExceptions(reason)) ||
    reasonFilterOnlyIncludesTriggers(reason))

const canSeeTriggersAndExceptions = (user: User, reason?: Reason): boolean =>
  user.hasAccessTo[Permission.Exceptions] &&
  user.hasAccessTo[Permission.Triggers] &&
  reason !== Reason.Triggers &&
  reason !== Reason.Exceptions

type FilterTarget = "BOTH" | "EXCEPTIONS" | "NONE" | "TRIGGERS"

const getFilterTarget = (user: User, reason: Reason | undefined, reasonCodes: string[] | undefined): FilterTarget => {
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
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason,
  reasonCodes?: string[]
): SelectQueryBuilder<CourtCase> => {
  const target = getFilterTarget(user, reason, reasonCodes)

  if (target === "TRIGGERS") {
    return query.andWhere({ triggerStatus: "Unresolved" })
  } else if (target === "EXCEPTIONS") {
    return query.andWhere(
      new Brackets((qb) => {
        qb.where({ errorStatus: "Unresolved" }).orWhere({ errorStatus: "Submitted" })
      })
    )
  } else if (target === "BOTH") {
    return query.andWhere(
      new Brackets((qb) => {
        qb.where({ triggerStatus: "Unresolved" }).orWhere(
          new Brackets((qb2) => {
            qb2.where({ errorStatus: "Unresolved" }).orWhere({ errorStatus: "Submitted" })
          })
        )
      })
    )
  }

  return query.andWhere("FALSE")
}

const filterIfResolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason,
  reasonCodes?: string[],
  resolvedByUsername?: string
) => {
  const target = getFilterTarget(user, reason, reasonCodes)

  if (target === "TRIGGERS") {
    query.andWhere({ triggerResolvedTimestamp: Not(IsNull()) })
  } else if (target === "EXCEPTIONS") {
    query.andWhere({ errorStatus: "Resolved" })
  } else if (target === "BOTH") {
    query.andWhere(
      new Brackets((qb) =>
        qb
          .where({ errorResolvedTimestamp: Not(IsNull()) })
          .orWhere({ errorStatus: "Resolved" })
          .orWhere({ triggerResolvedTimestamp: Not(IsNull()) })
      )
    )
  } else {
    return query.andWhere("FALSE")
  }

  if (resolvedByUsername) {
    query.andWhere(
      new Brackets((qb) => {
        if (reasonFilterOnlyIncludesTriggers(reason)) {
          qb.where({
            triggerResolvedBy: resolvedByUsername
          })
        } else if (reasonFilterOnlyIncludesExceptions(reason)) {
          qb.where({
            errorResolvedBy: resolvedByUsername
          })
        } else {
          qb.where({
            errorResolvedBy: resolvedByUsername
          })
            .orWhere({
              triggerResolvedBy: resolvedByUsername
            })
            .orWhere("trigger.resolvedBy = :triggerResolver", {
              triggerResolver: resolvedByUsername
            })
        }
      })
    )
  }

  return query
}

const filterByReasonAndResolutionStatus = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason,
  reasonCodes?: string[],
  caseState?: CaseState,
  resolvedByUsername?: string
): SelectQueryBuilder<CourtCase> => {
  caseState = caseState ?? "Unresolved"

  if (caseState === "Unresolved") {
    query = filterIfUnresolved(query, user, reason, reasonCodes)
  } else if (caseState === "Resolved") {
    query = filterIfResolved(query, user, reason, reasonCodes, resolvedByUsername)
  }

  return query
}

export default filterByReasonAndResolutionStatus
