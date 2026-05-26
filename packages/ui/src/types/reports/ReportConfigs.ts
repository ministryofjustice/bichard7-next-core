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
import {
  bailsColumns,
  codeDetailUserColumns,
  domesticViolenceColumns,
  exceptionsColumns,
  userPerformanceSummaryColumns,
  warrantsColumns
} from "types/reports/Columns"
import type { FlatReportConfig, GroupedReportConfig, NestedGroupedReportConfig } from "types/reports/Config"

export const ReportConfigs = {
  bails: {
    endpoint: V1.CasesReportsBails,
    structure: "flat",
    columns: bailsColumns,
    reportType: "bails",
    totalsConfig: [
      { key: "total", label: "Total triggers" },
      { key: "resolved", label: "Resolved" },
      { key: "unresolved", label: "Unresolved" }
    ],
    calculateTotalsCallback: (totals: Record<string, number>, rows: CaseForBailsReportDto[]) => {
      rows.forEach((row) => {
        totals.total = totals.total + 1
        totals.resolved = totals.resolved + (row.triggerStatus === "Resolved" ? 1 : 0)
        totals.unresolved = totals.unresolved + (row.triggerStatus === "Unresolved" ? 1 : 0)
      })
    }
  } satisfies FlatReportConfig<CaseForBailsReportDto>,
  "domestic violence": {
    endpoint: V1.CasesReportsDomesticViolence,
    structure: "flat",
    columns: domesticViolenceColumns,
    reportType: "domestic violence",
    totalsConfig: [{ key: "total", label: "Total court cases" }],
    calculateTotalsCallback: (totals: Record<string, number>, rows: CaseForDomesticViolenceReportDto[]) => {
      totals.total = new Set(rows.map((row) => row.errorId)).size
    }
  } satisfies FlatReportConfig<CaseForDomesticViolenceReportDto>,
  exceptions: {
    endpoint: V1.CasesReportsExceptions,
    structure: "grouped",
    tableNameKey: "username",
    tableDataListKey: "cases",
    columns: exceptionsColumns,
    reportType: "exceptions",
    totalsConfig: [
      { key: "total", label: "Total exceptions and triggers" },
      { key: "exceptions", label: "Exceptions" },
      { key: "triggers", label: "Triggers" }
    ]
  } satisfies GroupedReportConfig<ExceptionReportDto, CaseForExceptionReportDto>,
  warrants: {
    endpoint: V1.CasesReportsWarrants,
    structure: "flat",
    columns: warrantsColumns,
    reportType: "warrants",
    totalsConfig: [
      { key: "total", label: "Total triggers" },
      { key: "resolved", label: "Resolved" },
      { key: "unresolved", label: "Unresolved" }
    ],
    calculateTotalsCallback: (totals: Record<string, number>, rows: CaseForWarrantsReportDto[]) => {
      rows.forEach((row) => {
        totals.total = totals.total + 1
        totals.resolved = totals.resolved + (row.triggerStatus === "Resolved" ? 1 : 0)
        totals.unresolved = totals.unresolved + (row.triggerStatus === "Unresolved" ? 1 : 0)
      })
    }
  } satisfies FlatReportConfig<CaseForWarrantsReportDto>,
  "user summary": {
    endpoint: V1.CasesReportsUserPerformanceSummary,
    structure: "grouped",
    tableNameKey: "date",
    tableDataListKey: "users",
    columns: userPerformanceSummaryColumns,
    formatter: "date",
    totalsConfig: [
      { key: "exceptionsResolved", label: "Exceptions resolved" },
      { key: "triggerResolved", label: "Triggers resolved" },
      { key: "totalNumberStillLocked", label: "Exceptions or triggers locked" }
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
