import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { every } from "lodash"
import type CourtCase from "services/entities/CourtCase"
import type User from "services/entities/User"
import type { SelectQueryBuilder } from "typeorm"
import { Brackets, IsNull, Not } from "typeorm"
import type { CaseState } from "types/CaseListQueryParams"
import { Reason } from "types/CaseListQueryParams"
import Permission from "types/Permission"

const reasonFilterOnlyIncludesTriggers = (reason?: Reason): boolean => reason === Reason.Triggers

const reasonFilterOnlyIncludesExceptions = (reason?: Reason): boolean => reason === Reason.Exceptions

const reasonCodesAreExceptionsOnly = (reasonCodes: string[] | undefined): boolean => {
  if (reasonCodes?.length === 0) {
    return false
  }

  return every(reasonCodes, (rc: string) => ExceptionCode[rc as keyof typeof ExceptionCode])
}

const reasonCodesAreTriggersOnly = (reasonCodes: string[] | undefined): boolean => {
  if (reasonCodes?.length === 0) {
    return false
  }

  return every(reasonCodes, (rc: string) => TriggerCode[rc as keyof typeof TriggerCode])
}

const shouldFilterForExceptions = (user: User, reason?: Reason): boolean =>
  (user.hasAccessTo[Permission.Exceptions] && !user.hasAccessTo[Permission.Triggers]) ||
  (user.hasAccessTo[Permission.Exceptions] && reasonFilterOnlyIncludesExceptions(reason))

const shouldFilterForTriggers = (user: User, reason?: Reason): boolean =>
  (user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) ||
  (user.hasAccessTo[Permission.Triggers] && reasonFilterOnlyIncludesTriggers(reason))

const canSeeTriggersAndException = (user: User, reason?: Reason): boolean =>
  user.hasAccessTo[Permission.Exceptions] &&
  user.hasAccessTo[Permission.Triggers] &&
  reason !== Reason.Triggers &&
  reason !== Reason.Exceptions

const filterIfUnresolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason,
  reasonCodes?: string[]
): SelectQueryBuilder<CourtCase> => {
  if (shouldFilterForTriggers(user, reason)) {
    query.andWhere({ triggerStatus: "Unresolved" })
  } else if (shouldFilterForExceptions(user, reason)) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ errorStatus: "Unresolved" }).orWhere({ errorStatus: "Submitted" })
      })
    )
  } else if (canSeeTriggersAndException(user, reason)) {
    if (reasonCodes && reasonCodesAreExceptionsOnly(reasonCodes)) {
      query.andWhere({ errorStatus: "Unresolved" }).orWhere({ errorStatus: "Submitted" })
    } else if (reasonCodes && reasonCodesAreTriggersOnly(reasonCodes)) {
      query.andWhere({ triggerStatus: "Unresolved" })
    } else {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({ triggerStatus: "Unresolved" }).orWhere(
            new Brackets((qb2) => {
              qb2.where({ errorStatus: "Unresolved" }).orWhere({ errorStatus: "Submitted" })
            })
          )
        })
      )
    }
  }

  return query
}

const filterIfResolved = (
  query: SelectQueryBuilder<CourtCase>,
  user: User,
  reason?: Reason,
  reasonCodes?: string[],
  resolvedByUsername?: string
) => {
  if (shouldFilterForTriggers(user, reason)) {
    query.andWhere({ triggerResolvedTimestamp: Not(IsNull()) })
  } else if (shouldFilterForExceptions(user, reason)) {
    query.andWhere({ errorStatus: "Resolved" })
  } else if (canSeeTriggersAndException(user, reason)) {
    if (reasonCodes && reasonCodesAreExceptionsOnly(reasonCodes)) {
      query.andWhere({ errorStatus: "Resolved" })
    } else if (reasonCodes && reasonCodesAreTriggersOnly(reasonCodes)) {
      query.andWhere({ triggerResolvedTimestamp: Not(IsNull()) })
    } else {
      query.andWhere(
        new Brackets((qb) =>
          qb
            .where({ errorResolvedTimestamp: Not(IsNull()) })
            .orWhere({ errorStatus: "Resolved" })
            .orWhere({ triggerResolvedTimestamp: Not(IsNull()) })
        )
      )
    }
  }

  if (resolvedByUsername || !user.hasAccessTo[Permission.ListAllCases]) {
    query.andWhere(
      new Brackets((qb) => {
        if (reasonFilterOnlyIncludesTriggers(reason)) {
          qb.where({
            triggerResolvedBy: resolvedByUsername ?? user.username
          })
        } else if (reasonFilterOnlyIncludesExceptions(reason)) {
          qb.where({
            errorResolvedBy: resolvedByUsername ?? user.username
          })
        } else {
          qb.where({
            errorResolvedBy: resolvedByUsername ?? user.username
          })
            .orWhere({
              triggerResolvedBy: resolvedByUsername ?? user.username
            })
            .orWhere("trigger.resolvedBy = :triggerResolver", {
              triggerResolver: resolvedByUsername ?? user.username
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
