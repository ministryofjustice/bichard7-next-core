import type ReportsApiClient from "services/api/ReportsApiClient"
import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { generateUrlSearchParams } from "services/api/utils/generateUrlSearchParams"
import type { BailsReportQuery } from "@moj-bichard7/common/contracts/BailsReport"
import type { DomesticViolenceReportQuery } from "@moj-bichard7/common/contracts/DomesticViolenceReport"
import type { WarrantsReportQuery } from "@moj-bichard7/common/contracts/WarrantsReport"
import type { ReportType } from "types/ReportType"
import type { BichardReportGateway, AnyReportQuery, AnyReportDto } from "services/api/interfaces/BichardReportGateway"
import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"

export default class BichardV1Report implements BichardReportGateway {
  readonly reportClient: ReportsApiClient

  constructor(reportClient: ReportsApiClient) {
    this.reportClient = reportClient
  }

  reportStrategy(reportType: ReportType, query: AnyReportQuery): AsyncIterable<AnyReportDto | Error> | Error {
    switch (reportType) {
      case "bails":
        return this.bailsReport({ fromDate: query.fromDate, toDate: query.toDate })
      case "exceptions":
        return this.exceptionsReport(query as ExceptionReportQuery)
      case "domestic violence":
        return this.domesticViolenceReport(query)
      case "warrants":
        return this.warrantsReport(query)
      default:
        return new Error(`Unknown report type: ${reportType}`)
    }
  }

  async *bailsReport(query: BailsReportQuery): AsyncIterable<CaseForBailsReportDto[] | Error> {
    try {
      yield* this.reportClient.fetchReport<CaseForBailsReportDto[]>(this.endpoint(V1.CasesReportsBails, query))
    } catch (error) {
      yield error as Error
    }
  }

  async *domesticViolenceReport(
    query: DomesticViolenceReportQuery
  ): AsyncIterable<CaseForDomesticViolenceReportDto[] | Error> {
    try {
      yield* this.reportClient.fetchReport<CaseForDomesticViolenceReportDto[]>(
        this.endpoint(V1.CasesReportsDomesticViolence, query)
      )
    } catch (error) {
      yield error as Error
    }
  }

  async *exceptionsReport(query: ExceptionReportQuery): AsyncIterable<ExceptionReportDto[] | Error> {
    try {
      yield* this.reportClient.fetchReport<ExceptionReportDto[]>(this.endpoint(V1.CasesReportsExceptions, query))
    } catch (error) {
      yield error as Error
    }
  }

  async *warrantsReport(query: WarrantsReportQuery): AsyncIterable<CaseForWarrantsReportDto[] | Error> {
    try {
      yield* this.reportClient.fetchReport<CaseForWarrantsReportDto[]>(this.endpoint(V1.CasesReportsWarrants, query))
    } catch (error) {
      yield error as Error
    }
  }

  private endpoint(route: string, query: AnyReportQuery): string {
    return `${route}?${generateUrlSearchParams(query)}`
  }
}
