import type CourtCase from "services/entities/CourtCase"
import type { CaseList, Report, ResolvedException } from "utils/reports/Report"
import { ReportType } from "./ReportTypes"
import { createResolvedExceptionsReportLines } from "./createResolvedExceptionsReportLines"
import { createCaseListReportLines } from "./createCaseListReportLines"

type ReportTypeMap = {
  [ReportType.RESOLVED_EXCEPTIONS]: ResolvedException
  [ReportType.CASE_LIST]: CaseList
}

type ReportGeneratorFn<T> = (cases: CourtCase[]) => Report<T>

const reportGenerator: {
  [K in keyof ReportTypeMap]: ReportGeneratorFn<ReportTypeMap[K]>
} = {
  [ReportType.RESOLVED_EXCEPTIONS]: createResolvedExceptionsReportLines,
  [ReportType.CASE_LIST]: createCaseListReportLines
}

export function createReport<T extends keyof ReportTypeMap>(
  cases: CourtCase[],
  reportType: T
): Report<ReportTypeMap[T]> {
  return reportGenerator[reportType](cases)
}
