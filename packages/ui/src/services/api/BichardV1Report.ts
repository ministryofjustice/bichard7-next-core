import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import type { UserPerformanceSummaryDto } from "@moj-bichard7/common/types/reports/UserPerformanceSummary"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"
import type { AnyReportQuery, BichardReportGateway } from "services/api/interfaces/BichardReportGateway"
import type ReportsApiClient from "services/api/ReportsApiClient"
import { generateUrlSearchParams } from "services/api/utils/generateUrlSearchParams"
import { ReportConfigs } from "types/reports/ReportConfigs"

export interface ReportDataMap {
  bails: CaseForBailsReportDto[]
  exceptions: ExceptionReportDto[]
  "domestic violence": CaseForDomesticViolenceReportDto[]
  warrants: CaseForWarrantsReportDto[]
  "user summary": UserPerformanceSummaryDto[]
  "user detail": UserPerformanceDetailDto[]
}

export default class BichardV1Report implements BichardReportGateway {
  readonly reportClient: ReportsApiClient

  constructor(reportClient: ReportsApiClient) {
    this.reportClient = reportClient
  }

  reportStrategy<T extends keyof ReportDataMap>(
    reportType: T,
    query: AnyReportQuery
  ): AsyncIterable<ReportDataMap[T] | Error> | Error {
    const config = ReportConfigs[reportType]

    if (!config) {
      return new Error(`Unknown report type: ${reportType}`)
    }

    return this.fetchReportData<ReportDataMap[T]>(config.endpoint, query)
  }

  private async *fetchReportData<R>(endpoint: string, query: AnyReportQuery): AsyncIterable<R | Error> {
    try {
      const url = `${endpoint}?${generateUrlSearchParams(query)}`
      yield* this.reportClient.fetchReport<R>(url)
    } catch (error) {
      yield error as Error
    }
  }
}
