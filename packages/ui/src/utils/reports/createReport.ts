import type CourtCase from "services/entities/CourtCase"
import type { Report, ResolvedException } from "utils/reports/Report"
import { ReportType } from "./ReportTypes"
import { createResolvedExceptionsReportLines } from "./createResolvedExceptionsReportLines"

type ReportTypeMap = {
  [ReportType.RESOLVED_EXCEPTIONS]: ResolvedException
}

type ReportGeneratorFn<T> = (cases: CourtCase[]) => Report<T>

const reportGenerator: {
  [K in keyof ReportTypeMap]: ReportGeneratorFn<ReportTypeMap[K]>
} = {
  [ReportType.RESOLVED_EXCEPTIONS]: createResolvedExceptionsReportLines
}

export function createReport<T extends keyof ReportTypeMap>(
  cases: CourtCase[],
  reportType: T
): Report<ReportTypeMap[T]> {
  return reportGenerator[reportType](cases)
}
