import CourtCase from "services/entities/CourtCase"
import type User from "services/entities/User"
import courtCasesByOrganisationUnitQuery from "services/queries/courtCasesByOrganisationUnitQuery"
import leftJoinAndSelectTriggersQuery from "services/queries/leftJoinAndSelectTriggersQuery"
import type { DataSource } from "typeorm"
import { Brackets, LessThanOrEqual, MoreThanOrEqual } from "typeorm"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import Permission from "types/Permission"
import type PromiseResult from "types/PromiseResult"
import type { ReportDateRange } from "types/ReportQueryParams"
import { CaseDetailsReportType } from "types/ReportQueryParams"
import { isError } from "types/Result"

const getCourtCasesForCaseDetailsReport = async (
  connection: DataSource,
  user: User,
  reportDateRange?: ReportDateRange,
  caseDetailsReportType: CaseDetailsReportType = CaseDetailsReportType.ExceptionsAndTriggers
): PromiseResult<ListCourtCaseResult> => {
  if (!user.hasAccessTo[Permission.ViewReports]) {
    return {
      result: [],
      totalCases: 0
    }
  }

  const repository = connection.getRepository(CourtCase)

  // TODO: We may reduce data once we have answers from UCP
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
      "courtCase.errorResolvedTimestamp",
      "courtCase.triggerResolvedTimestamp",
      "courtCase.errorResolvedBy",
      "courtCase.triggerResolvedBy",
      "courtCase.defendantName",
      "courtCase.errorLockedByUsername",
      "courtCase.triggerLockedByUsername"
    ])
  query = courtCasesByOrganisationUnitQuery(query, user)
  leftJoinAndSelectTriggersQuery(query, user.excludedTriggers, "Resolved")
    .leftJoinAndSelect("courtCase.notes", "note")
    .leftJoin("courtCase.errorLockedByUser", "errorLockedByUser")
    .addSelect(["errorLockedByUser.forenames", "errorLockedByUser.surname"])
    .leftJoin("courtCase.triggerLockedByUser", "triggerLockedByUser")
    .addSelect(["triggerLockedByUser.forenames", "triggerLockedByUser.surname"])

  // Filters
  if (caseDetailsReportType === CaseDetailsReportType.Exceptions) {
    query
      .andWhere({ errorResolvedTimestamp: MoreThanOrEqual(reportDateRange?.from) })
      .andWhere({ errorResolvedTimestamp: LessThanOrEqual(reportDateRange?.to) })
  }

  if (caseDetailsReportType === CaseDetailsReportType.Triggers) {
    query
      .andWhere({ triggerResolvedTimestamp: MoreThanOrEqual(reportDateRange?.from) })
      .andWhere({ triggerResolvedTimestamp: LessThanOrEqual(reportDateRange?.to) })
  }

  if (caseDetailsReportType === CaseDetailsReportType.ExceptionsAndTriggers) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where({ errorResolvedTimestamp: MoreThanOrEqual(reportDateRange?.from) })
          .andWhere({
            errorResolvedTimestamp: LessThanOrEqual(reportDateRange?.to)
          })
          .orWhere({ triggerResolvedTimestamp: MoreThanOrEqual(reportDateRange?.from) })
          .andWhere({ triggerResolvedTimestamp: LessThanOrEqual(reportDateRange?.to) })
      })
    )
  }

  const result = await query.getManyAndCount().catch((error: Error) => error)
  return isError(result)
    ? result
    : {
        result: result[0],
        totalCases: result[1]
      }
}

export default getCourtCasesForCaseDetailsReport
