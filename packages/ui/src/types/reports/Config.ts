import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import type { ReportColumn } from "./Columns"

export type ReportStructure = "flat" | "grouped" | "nested"

export type TotalColumnConfig = {
  key: string
  label: string
}

interface BaseConfig {
  endpoint: string
  reportType: ReportType
}

export type FlatReportConfig<TRow> = {
  structure: Extract<ReportStructure, "flat">
  columns: ReportColumn<TRow>[]
} & BaseConfig

export interface Formatter {
  formatter?: "date" | "datetime"
}

export type GroupedReportConfig<TGroup, TRow> = {
  structure: Extract<ReportStructure, "grouped">
  groupNameKey: Extract<keyof TGroup, string>
  dataListKey: Extract<keyof TGroup, string>
  columns: ReportColumn<TRow>[]
  formatter?: Formatter
  totalsConfig?: TotalColumnConfig[]
} & BaseConfig &
  Formatter

export type NestedGroupedReportConfig<TOuterGroup, TInnerGroup, TRow> = {
  structure: Extract<ReportStructure, "nested">
  outerGroupNameKey: Extract<keyof TOuterGroup, string>
  outerDataListKeys: Extract<keyof TOuterGroup, string>[]
  innerGroupNameKey: Extract<keyof TInnerGroup, string>
  innerDataListKey: Extract<keyof TInnerGroup, string>
  columns: ReportColumn<TRow>[][]
  formatter?: Formatter
  totalsConfig?: TotalColumnConfig[]
} & BaseConfig &
  Formatter

export type ReportConfig<TOuterGroup = Record<string, never>, TInnerGroup = Record<string, never>, TRow = never> =
  | FlatReportConfig<TRow>
  | GroupedReportConfig<TOuterGroup, TRow>
  | NestedGroupedReportConfig<TOuterGroup, TInnerGroup, TRow>
