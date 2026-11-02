import type { BailsReportQuery } from "@moj-bichard7/common/contracts/BailsReport"
import type { CommunitySentenceReportQuery } from "@moj-bichard7/common/contracts/CommunitySentenceReport"
import type { DomesticViolenceReportQuery } from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { UserPerformanceDetailReportQuery } from "@moj-bichard7/common/contracts/UserPerformanceDetailReportQuery"
import type { UserSummaryReportQuery } from "@moj-bichard7/common/contracts/UserSummaryReportQuery"
import type { WarrantsReportQuery } from "@moj-bichard7/common/contracts/WarrantsReport"
import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import type { UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import type { UserPerformanceSummaryDto } from "@moj-bichard7/common/types/reports/UserPerformanceSummary"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"
import type ReportsApiClient from "services/api/ReportsApiClient"

type AnyReportDto =
  | CaseForBailsReportDto[]
  | ExceptionReportDto[]
  | CaseForDomesticViolenceReportDto[]
  | CaseForWarrantsReportDto[]
  | UserPerformanceSummaryDto[]
  | UserPerformanceDetailDto[]
  | CommunitySentenceReportDto[]

export type AnyReportQuery =
  | BailsReportQuery
  | ExceptionReportQuery
  | DomesticViolenceReportQuery
  | WarrantsReportQuery
  | UserSummaryReportQuery
  | UserPerformanceDetailReportQuery
  | CommunitySentenceReportQuery

export interface BichardReportGateway {
  readonly reportClient: ReportsApiClient

  reportStrategy(reportType: ReportType, query: AnyReportQuery): AsyncIterable<AnyReportDto | Error> | Error
}
