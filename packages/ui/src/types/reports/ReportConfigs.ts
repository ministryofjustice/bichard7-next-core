import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { CaseForExceptionReportDto, ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type {
  CodeDetailDto,
  CodeDetailUserDto,
  UserPerformanceDetailDto
} from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import type {
  UserForPerformanceSummaryDto,
  UserPerformanceSummaryDto
} from "@moj-bichard7/common/types/reports/UserPerformanceSummary"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"
import type { ReportDataMap } from "services/api/BichardV1Report"
import {
  bailsColumns,
  codeDetailUserColumns,
  domesticViolenceColumns,
  exceptionsColumns,
  userPerformanceSummaryColumns,
  warrantsColumns
} from "types/reports/Columns"
import type {
  FlatReportConfig,
  GroupedReportConfig,
  NestedGroupedReportConfig,
  ReportConfig
} from "types/reports/Config"

export const ReportConfigs: Record<keyof ReportDataMap, ReportConfig> = {
  bails: {
    endpoint: V1.CasesReportsBails,
    structure: "flat",
    columns: bailsColumns,
    reportType: "bails"
  } satisfies FlatReportConfig<CaseForBailsReportDto>,
  "domestic violence": {
    endpoint: V1.CasesReportsDomesticViolence,
    structure: "flat",
    columns: domesticViolenceColumns,
    reportType: "domestic violence"
  } satisfies FlatReportConfig<CaseForDomesticViolenceReportDto>,
  exceptions: {
    endpoint: V1.CasesReportsExceptions,
    structure: "grouped",
    groupNameKey: "username",
    dataListKey: "cases",
    columns: exceptionsColumns,
    reportType: "exceptions"
  } satisfies GroupedReportConfig<ExceptionReportDto, CaseForExceptionReportDto>,
  warrants: {
    endpoint: V1.CasesReportsWarrants,
    structure: "flat",
    columns: warrantsColumns,
    reportType: "warrants"
  } satisfies FlatReportConfig<CaseForWarrantsReportDto>,
  "user summary": {
    endpoint: V1.CasesReportsUserPerformanceSummary,
    structure: "grouped",
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
  } satisfies GroupedReportConfig<UserPerformanceSummaryDto, UserForPerformanceSummaryDto>,
  "user detail": {
    structure: "nested",
    endpoint: V1.CasesReportsUserPerformanceDetail,
    groupNameKey: "date",
    groupDataListKey: "codeDetails",
    tableNameKey: "description",
    tableDataListKey: "users",
    columns: codeDetailUserColumns,
    columnSelectorKey: "type",
    formatter: "date",
    totalsConfig: [
      { key: "resolved", label: "Resolved" },
      { key: "totalLocked", label: "Locked" }
    ],
    reportType: "user detail"
  } satisfies NestedGroupedReportConfig<UserPerformanceDetailDto, CodeDetailDto, CodeDetailUserDto>
}
