import type { DateRange } from "@moj-bichard7/common/types/DateRange"
import Permission from "@moj-bichard7/common/types/Permission"
import { endOfDay, startOfDay } from "date-fns"
import type { DataSource, SelectQueryBuilder } from "typeorm"
import { Brackets, ILike, IsNull, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm"
import type { CaseListQueryParams, CaseState, QueryOrder } from "types/CaseListQueryParams"
import { LockedState } from "types/CaseListQueryParams"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import type PromiseResult from "types/PromiseResult"
import { isError } from "types/Result"
import { formatName } from "../helpers/formatName"
import CourtCase from "./entities/CourtCase"
import getLongTriggerCode from "./entities/transformers/getLongTriggerCode"
import type User from "./entities/User"
import filterByReasonAndResolutionStatus from "./filters/filterByReasonAndResolutionStatus"
import config from "./listCourtCasesConfig"
import courtCasesByOrganisationUnitQuery from "./queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "./queries/leftJoinAndSelectTriggersQuery"

const getExcludedTriggers = (excludedTriggers?: string[]): string[] =>
  excludedTriggers && excludedTriggers.length > 0 ? excludedTriggers : [""]

const baseQuery = (
  connection: DataSource,
  selectColumns: string[],
  user: User,
  caseState: CaseState,
  page: number,
  maxPageItems: number
): SelectQueryBuilder<CourtCase> => {
  const pageNumValidated = page
  const maxPageItemsValidated = maxPageItems
  const repository = connection.getRepository(CourtCase)

  let query = repository.createQueryBuilder("courtCase").select(selectColumns)
  query = courtCasesByOrganisationUnitQuery(query, user)

  leftJoinAndSelectTriggersQuery(query, user.excludedTriggers, caseState)
    .leftJoinAndSelect("courtCase.notes", "note")
    .leftJoin("courtCase.errorLockedByUser", "errorLockedByUser")
    .addSelect(["errorLockedByUser.forenames", "errorLockedByUser.surname"])
    .leftJoin("courtCase.triggerLockedByUser", "triggerLockedByUser")
    .addSelect(["triggerLockedByUser.forenames", "triggerLockedByUser.surname"])

  if (pageNumValidated !== config.BYPASS_PAGE_LIMIT && maxPageItemsValidated !== config.BYPASS_PAGE_LIMIT) {
    query.skip(pageNumValidated * maxPageItemsValidated).take(maxPageItemsValidated)
  }

  return query
}

const caseSortOrder = (
  query: SelectQueryBuilder<CourtCase>,
  order?: QueryOrder,
  orderBy?: string
): SelectQueryBuilder<CourtCase> => {
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

  return query
}

interface Filters {
  defendantName?: string
  courtName?: string
  ptiurn?: string
  asn?: string
  reasonCodes?: string[]
  courtDateRange?: DateRange | DateRange[]
  resolvedByUsername?: string
}

const filters = (
  query: SelectQueryBuilder<CourtCase>,
  { defendantName, courtName, ptiurn, asn, reasonCodes, courtDateRange, resolvedByUsername }: Filters
): SelectQueryBuilder<CourtCase> => {
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

  return query
}

const resolvedCasesDateRange = (
  query: SelectQueryBuilder<CourtCase>,
  caseState: CaseState,
  resolvedDateRange?: DateRange
): SelectQueryBuilder<CourtCase> => {
  if (caseState === "Resolved" && resolvedDateRange?.from) {
    query.andWhere({ resolutionTimestamp: MoreThanOrEqual(startOfDay(resolvedDateRange.from)) })
  }

  if (caseState === "Resolved" && resolvedDateRange?.to) {
    query.andWhere({ resolutionTimestamp: LessThanOrEqual(endOfDay(resolvedDateRange.to)) })
  }

  return query
}

const exceptionsAndTriggers = (
  query: SelectQueryBuilder<CourtCase>,
  caseState: CaseState,
  user: User
): SelectQueryBuilder<CourtCase> => {
  const exceptionsAndTriggerHandlersQuery = []
  const exceptionsAndTriggerHandlersParams: Record<string, string | string[]> = {
    caseStatus: caseState === "Resolved" ? ["2"] : ["1", "3"]
  }
  if (user.hasAccessTo[Permission.Exceptions]) {
    exceptionsAndTriggerHandlersQuery.push("(courtCase.errorCount > 0 and courtCase.errorStatus IN (:...caseStatus))")
  }

  if (user.hasAccessTo[Permission.Triggers]) {
    exceptionsAndTriggerHandlersQuery.push(
      "(SELECT COUNT(*) FROM br7own.error_list_triggers AS T1 WHERE T1.error_id = courtCase.errorId AND T1.status IN (:...caseStatus) AND T1.trigger_code NOT IN (:...excludedTriggers)) > 0"
    )
    exceptionsAndTriggerHandlersParams["excludedTriggers"] = getExcludedTriggers(user.excludedTriggers)
  }

  if (exceptionsAndTriggerHandlersQuery.length > 0) {
    query.andWhere(`(${exceptionsAndTriggerHandlersQuery.join(" OR ")})`, exceptionsAndTriggerHandlersParams)
  } else {
    query.andWhere("false")
  }

  return query
}

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
  selectColumns: string[] = config.CaseListQuery
): PromiseResult<ListCourtCaseResult> => {
  let query: SelectQueryBuilder<CourtCase> = baseQuery(
    connection,
    selectColumns,
    user,
    caseState ?? "Unresolved",
    (page ?? 1) - 1,
    maxPageItems ?? 25
  )

  query = caseSortOrder(query, order, orderBy)

  query = filters(query, { defendantName, courtName, ptiurn, asn, reasonCodes, courtDateRange, resolvedByUsername })

  // Existing filters
  query = filterByReasonAndResolutionStatus(query, user, reason, reasonCodes, caseState, resolvedByUsername)

  query = resolvedCasesDateRange(query, caseState ?? "Unresolved", resolvedDateRange)

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

  query = exceptionsAndTriggers(query, caseState, user)

  const result = await query.getManyAndCount().catch((error: Error) => error)
  return isError(result)
    ? result
    : {
        result: result[0],
        totalCases: result[1]
      }
}

export default listCourtCases
