import type { ReportColumn } from "./Columns"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"

type Formatter = "date" | "datetime"

export type TotalColumnConfig = {
  key: string
  label: string
}

interface BaseConfig {
  endpoint: string
  reportType: ReportType
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
  formatter?: Formatter
  totalsConfig?: TotalColumnConfig[]
} & BaseConfig

export type ReportConfig<TGroup = Record<string, never>, TRow = never> =
  | FlatReportConfig<TRow>
  | GroupedReportConfig<TGroup, TRow>
