import type ReportsApiClient from "services/api/ReportsApiClient"
import type { BailsReportQuery } from "@moj-bichard7/common/contracts/BailsReport"
import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { DomesticViolenceReportQuery } from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import type { WarrantsReportQuery } from "@moj-bichard7/common/contracts/WarrantsReport"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"

type AnyReportDto =
  | CaseForBailsReportDto[]
  | ExceptionReportDto[]
  | CaseForDomesticViolenceReportDto[]
  | CaseForWarrantsReportDto[]

export type AnyReportQuery = BailsReportQuery | ExceptionReportQuery | DomesticViolenceReportQuery | WarrantsReportQuery

export interface BichardReportGateway {
  readonly reportClient: ReportsApiClient

  reportStrategy(reportType: ReportType, query: AnyReportQuery): AsyncIterable<AnyReportDto | Error> | Error
}
