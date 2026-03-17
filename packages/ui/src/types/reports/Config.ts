import type { BaseReportColumn, ReportColumn } from "./Columns"
import { bailsColumns, domesticViolenceColumns, exceptionsColumns, warrantsColumns } from "./Columns"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"
import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"
import type { ExceptionReportDto, CaseForExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"

interface BaseConfig {
  endpoint: string
}

export type FlatReportConfig<TRow> = {
  isGrouped: false
  columns: ReportColumn<TRow>[]
} & BaseConfig

export type GroupedReportConfig<TGroup, TRow> = {
  isGrouped: true
  groupNameKey: Extract<keyof TGroup, string>
  dataListKey: Extract<keyof TGroup, string>
  columns: ReportColumn<TRow>[]
} & BaseConfig

export type ReportConfig =
  | ({ isGrouped: false; columns: BaseReportColumn[] } & BaseConfig)
  | ({ isGrouped: true; groupNameKey: string; dataListKey: string; columns: BaseReportColumn[] } & BaseConfig)

export const ReportConfigs: Record<ReportType, ReportConfig> = {
  bails: {
    endpoint: V1.CasesReportsBails,
    isGrouped: false,
    columns: bailsColumns
  } satisfies FlatReportConfig<CaseForBailsReportDto>,
  "domestic violence": {
    endpoint: V1.CasesReportsDomesticViolence,
    isGrouped: false,
    columns: domesticViolenceColumns
  } satisfies FlatReportConfig<CaseForDomesticViolenceReportDto>,
  exceptions: {
    endpoint: V1.CasesReportsExceptions,
    isGrouped: true,
    groupNameKey: "username",
    dataListKey: "cases",
    columns: exceptionsColumns
  } satisfies GroupedReportConfig<ExceptionReportDto, CaseForExceptionReportDto>,
  warrants: {
    endpoint: V1.CasesReportsWarrants,
    isGrouped: false,
    columns: warrantsColumns
  } satisfies FlatReportConfig<CaseForWarrantsReportDto>
}
