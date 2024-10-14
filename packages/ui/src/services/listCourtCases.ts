import type { DataSource } from "typeorm"
import { Brackets, ILike, IsNull, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm"
import type { CaseListQueryParams } from "types/CaseListQueryParams"
import { LockedState } from "types/CaseListQueryParams"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import Permission from "types/Permission"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import CourtCase from "./entities/CourtCase"
import getLongTriggerCode from "./entities/transformers/getLongTriggerCode"
import type User from "./entities/User"
import filterByReasonAndResolutionStatus from "./filters/filterByReasonAndResolutionStatus"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "./queries/leftJoinAndSelectTriggersQuery"
import QueryColumns from "./QueryColumns"
import { formatName } from "../helpers/formatName"

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
    resolvedByUsername,
    resolvedDateRange,
    asn
  }: CaseListQueryParams,
  user: User,
  selectColumns: string[] = QueryColumns.CaseListQuery
): PromiseResult<ListCourtCaseResult> => {
  const pageNumValidated = (page ? page : 1) - 1 // -1 because the db index starts at 0
  const maxPageItemsValidated = maxPageItems ? maxPageItems : 25
  const repository = connection.getRepository(CourtCase)
  let query = repository.createQueryBuilder("courtCase").select(selectColumns)
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
    const splitDefendantName = formatName(defendantName)

    query.andWhere({
      defendantName: ILike(splitDefendantName)
    })
  }

  if (courtName) {
    const courtNameLike = {
      courtName: ILike(`%${courtName}%`)
    }
    query.andWhere(courtNameLike)
  }

  if (ptiurn) {
    const ptiurnLike = {
      ptiurn: ILike(`%${ptiurn}%`)
    }
    query.andWhere(ptiurnLike)
  }

  if (asn) {
    query.andWhere({
      asn: ILike(`%${asn}%`)
    })
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
          // match exceptions in the middle of the error report
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
                  .andWhere({
                    courtDate: MoreThanOrEqual(dateRange.from)
                  })
                  .andWhere({
                    courtDate: LessThanOrEqual(dateRange.to)
                  })
              })
            )
          })
        })
      )
    } else {
      query
        .andWhere({
          courtDate: MoreThanOrEqual(courtDateRange.from)
        })
        .andWhere({
          courtDate: LessThanOrEqual(courtDateRange.to)
        })
    }
  }

  if (resolvedByUsername) {
    const splitResolvedByUsername = formatName(resolvedByUsername)

    query.andWhere(
      new Brackets((qb) => {
        qb.where({
          errorResolvedBy: ILike(splitResolvedByUsername)
        }).orWhere({
          triggerResolvedBy: ILike(splitResolvedByUsername)
        })
      })
    )
  }

  // Existing filters
  filterByReasonAndResolutionStatus(query, user, reason, reasonCodes, caseState, resolvedByUsername)

  if (caseState === "Resolved" && resolvedDateRange?.from) {
    query.andWhere({ resolutionTimestamp: MoreThanOrEqual(resolvedDateRange?.from) })
  }

  if (caseState === "Resolved" && resolvedDateRange?.to) {
    query.andWhere({ resolutionTimestamp: LessThanOrEqual(resolvedDateRange?.to) })
  }

  if (allocatedToUserName) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({
          errorLockedByUsername: allocatedToUserName
        }).orWhere({
          triggerLockedByUsername: allocatedToUserName
        })
      })
    )
  }

  if (lockedState !== undefined) {
    if (lockedState === LockedState.Locked) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({
            errorLockedByUsername: Not(IsNull())
          }).orWhere({
            triggerLockedByUsername: Not(IsNull())
          })
        })
      )
    } else if (lockedState === LockedState.Unlocked) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where({
            errorLockedByUsername: IsNull()
          }).andWhere({
            triggerLockedByUsername: IsNull()
          })
        })
      )
    }
  }

  if (!user.hasAccessTo[Permission.Triggers] && !user.hasAccessTo[Permission.Exceptions]) {
    query.andWhere("false")
  }

  if (!user.hasAccessTo[Permission.Triggers]) {
    query.andWhere({
      errorCount: MoreThan(0)
    })
  }

  if (!user.hasAccessTo[Permission.Exceptions]) {
    query.andWhere({
      triggerCount: MoreThan(0)
    })
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
