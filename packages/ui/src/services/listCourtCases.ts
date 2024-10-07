import { Brackets, DataSource, ILike, IsNull, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm"
import { CaseListQueryParams, LockedState } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import Permission from "types/Permission"
import PromiseResult from "types/PromiseResult"

import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import getLongTriggerCode from "./entities/transformers/getLongTriggerCode"
import User from "./entities/User"
import filterByReasonAndResolutionStatus from "./filters/filterByReasonAndResolutionStatus"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "./queries/leftJoinAndSelectTriggersQuery"

const listCourtCases = async (
  connection: DataSource,
  {
    page,
    maxPageItems,
    orderBy,
    order,
    defendantName,
    courtName,
    ptiurn,
    reason,
    courtDateRange,
    lockedState,
    caseState,
    allocatedToUserName,
    reasonCodes,
    resolvedByUsername
  }: CaseListQueryParams,
  user: User
): PromiseResult<ListCourtCaseResult> => {
  const pageNumValidated = (page ? page : 1) - 1 // -1 because the db index starts at 0
  const maxPageItemsValidated = maxPageItems ? maxPageItems : 25
  const repository = connection.getRepository(CourtCase)
  let query = repository
    .createQueryBuilder("courtCase")
    .select([
      "courtCase.errorId",
      "courtCase.triggerCount",
      "courtCase.isUrgent",
      "courtCase.asn",
      "courtCase.errorReport",
      "courtCase.errorReason",
      "courtCase.triggerReason",
      "courtCase.errorCount",
      "courtCase.errorStatus",
      "courtCase.triggerStatus",
      "courtCase.courtDate",
      "courtCase.ptiurn",
      "courtCase.courtName",
      "courtCase.resolutionTimestamp",
      "courtCase.errorResolvedBy",
      "courtCase.triggerResolvedBy",
      "courtCase.defendantName",
      "courtCase.errorLockedByUsername",
      "courtCase.triggerLockedByUsername"
    ])
  query = courtCasesByOrganisationUnitQuery(query, user)
  leftJoinAndSelectTriggersQuery(query, user.excludedTriggers, caseState ?? "Unresolved")
    .leftJoinAndSelect("courtCase.notes", "note")
    .leftJoin("courtCase.errorLockedByUser", "errorLockedByUser")
    .addSelect(["errorLockedByUser.forenames", "errorLockedByUser.surname"])
    .leftJoin("courtCase.triggerLockedByUser", "triggerLockedByUser")
    .addSelect(["triggerLockedByUser.forenames", "triggerLockedByUser.surname"])
    .skip(pageNumValidated * maxPageItemsValidated)
    .take(maxPageItemsValidated)

  const sortOrder = order === "desc" ? "DESC" : "ASC"

  // Primary sorts
  const orderByQuery = `courtCase.${orderBy ?? "errorId"}`
  query.orderBy(orderByQuery, sortOrder)

  // Secondary sorts
  if (orderBy !== "courtDate") {
    query.addOrderBy("courtCase.courtDate", "DESC")
  }
  if (orderBy !== "ptiurn") {
    query.addOrderBy("courtCase.ptiurn")
  }

  // Filters
  if (defendantName) {
    let splitDefendantName = defendantName.replace(/\*|\s+/g, "%")

    if (!splitDefendantName.endsWith("%")) {
      splitDefendantName = `${splitDefendantName}%`
    }

    query.andWhere({ defendantName: ILike(splitDefendantName) })
  }

  if (courtName) {
    const courtNameLike = { courtName: ILike(`%${courtName}%`) }
    query.andWhere(courtNameLike)
  }

  if (ptiurn) {
    const ptiurnLike = { ptiurn: ILike(`%${ptiurn}%`) }
    query.andWhere(ptiurnLike)
  }

  if (reasonCodes?.length) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where("trigger.trigger_code ilike any(array[:...triggers])", {
          triggers: reasonCodes.map((reasonCode) => getLongTriggerCode(reasonCode))
        })
          // match exceptions at the start of the error_report
          .orWhere("courtCase.error_report ilike any(array[:...firstExceptions])", {
            firstExceptions: reasonCodes.map((reasonCode) => `${reasonCode}||%`)
          })
          // match exceptions ins the middle of the error report
          .orWhere("courtCase.error_report ilike any(array[:...exceptions])", {
            exceptions: reasonCodes.map((reasonCode) => `% ${reasonCode}||%`)
          })
      })
    )
  }

  if (courtDateRange) {
    if (Array.isArray(courtDateRange)) {
      query.andWhere(
        new Brackets((qb) => {
          courtDateRange.forEach((dateRange) => {
            qb.orWhere(
              new Brackets((dateRangeQuery) => {
                dateRangeQuery
                  .andWhere({ courtDate: MoreThanOrEqual(dateRange.from) })
                  .andWhere({ courtDate: LessThanOrEqual(dateRange.to) })
              })
            )
          })
        })
      )
    } else {
      query
        .andWhere({ courtDate: MoreThanOrEqual(courtDateRange.from) })
        .andWhere({ courtDate: LessThanOrEqual(courtDateRange.to) })
    }
  }

  filterByReasonAndResolutionStatus(query, user, reason, reasonCodes, caseState, resolvedByUsername)

  if (allocatedToUserName) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ errorLockedByUsername: allocatedToUserName }).orWhere({
          triggerLockedByUsername: allocatedToUserName
        })
      })
    )
  }

  if (lockedState !== undefined) {
    if (lockedState === LockedState.Locked) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({ errorLockedByUsername: Not(IsNull()) }).orWhere({ triggerLockedByUsername: Not(IsNull()) })
        })
      )
    } else if (lockedState === LockedState.Unlocked) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({ errorLockedByUsername: IsNull() }).andWhere({ triggerLockedByUsername: IsNull() })
        })
      )
    }
  }

  if (!user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) {
    query.andWhere("false")
  }

  if (!user.hasAccessTo[Permission.Triggers]) {
    query.andWhere({ errorCount: MoreThan(0) })
  }

  if (!user.hasAccessTo[Permission.Exceptions]) {
    query.andWhere({ triggerCount: MoreThan(0) })
  }

  const result = await query.getManyAndCount().catch((error: Error) => error)
  return isError(result)
    ? result
    : {
        result: result[0],
        totalCases: result[1]
      }
}

export default listCourtCases
