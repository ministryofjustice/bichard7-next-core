import type { ReportDataMap } from "services/api/BichardV1Report"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import {
  bailsColumns,
  domesticViolenceColumns,
  exceptionsColumns,
  warrantsColumns,
  userPerformanceSummaryColumns
} from "types/reports/Columns"
import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { ExceptionReportDto, CaseForExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"
import type { ReportConfig, FlatReportConfig, GroupedReportConfig } from "types/reports/Config"

export const ReportConfigs: Record<keyof ReportDataMap, ReportConfig> = {
  bails: {
    endpoint: V1.CasesReportsBails,
    isGrouped: false,
    columns: bailsColumns,
    reportType: "bails"
  } satisfies FlatReportConfig<CaseForBailsReportDto>,
  "domestic violence": {
    endpoint: V1.CasesReportsDomesticViolence,
    isGrouped: false,
    columns: domesticViolenceColumns,
    reportType: "domestic violence"
  } satisfies FlatReportConfig<CaseForDomesticViolenceReportDto>,
  exceptions: {
    endpoint: V1.CasesReportsExceptions,
    isGrouped: true,
    groupNameKey: "username",
    dataListKey: "cases",
    columns: exceptionsColumns,
    reportType: "exceptions"
  } satisfies GroupedReportConfig<ExceptionReportDto, CaseForExceptionReportDto>,
  warrants: {
    endpoint: V1.CasesReportsWarrants,
    isGrouped: false,
    columns: warrantsColumns,
    reportType: "warrants"
  } satisfies FlatReportConfig<CaseForWarrantsReportDto>,
  "user summary": {
    endpoint: V1.CasesReportsUserPerformanceSummary,
    isGrouped: true,
    groupNameKey: "date",
    dataListKey: "users",
    columns: userPerformanceSummaryColumns,
    formatter: "date",
    totalsConfig: [
      { key: "exceptionsResolved", label: "Exceptions Resolved" },
      { key: "triggerResolved", label: "Triggers Resolved" },
      { key: "totalNumberStillLocked", label: "Exceptions/Triggers Locked" }
    ],
    reportType: "user summary"
  }
}
