import type { BaseReportColumn, ReportColumn } from "./Columns"
import { bailsColumns, domesticViolenceColumns, exceptionsColumns, warrantsColumns } from "./Columns"
import type { ReportType } from "./ReportType"
import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { ExceptionReportDto, CaseForExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"

export type FlatReportConfig<TRow> = {
  isGrouped: false
  columns: ReportColumn<TRow>[]
}

export type GroupedReportConfig<TGroup, TRow> = {
  isGrouped: true
  groupNameKey: Extract<keyof TGroup, string>
  dataListKey: Extract<keyof TGroup, string>
  columns: ReportColumn<TRow>[]
}

export type ReportConfig =
  | { isGrouped: false; columns: BaseReportColumn[] }
  | { isGrouped: true; groupNameKey: string; dataListKey: string; columns: BaseReportColumn[] }

export const ReportConfigs: Record<ReportType, ReportConfig> = {
  bails: {
    isGrouped: false,
    columns: bailsColumns
  } satisfies FlatReportConfig<CaseForBailsReportDto>,
  "domestic violence": {
    isGrouped: false,
    columns: domesticViolenceColumns
  } satisfies FlatReportConfig<CaseForDomesticViolenceReportDto>,
  exceptions: {
    isGrouped: true,
    groupNameKey: "username",
    dataListKey: "cases",
    columns: exceptionsColumns
  } satisfies GroupedReportConfig<ExceptionReportDto, CaseForExceptionReportDto>,
  warrants: {
    isGrouped: false,
    columns: warrantsColumns
  } satisfies FlatReportConfig<CaseForWarrantsReportDto>
}
