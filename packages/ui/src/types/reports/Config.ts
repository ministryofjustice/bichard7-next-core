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
  totalsConfig?: TotalColumnConfig[]
  calculateTotalsCallback?: (totals: Record<string, number>, rows: TRow[]) => void
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

export type ColumnResolver<T> = (data: unknown) => ReportColumn<T>[]

export type NestedGroupedReportConfig<TOuterGroup, TInnerGroup, TRow> = {
  structure: Extract<ReportStructure, "nested">
  groupNameKey: Extract<keyof TOuterGroup, string>
  groupDataListKey: Extract<keyof TOuterGroup, string>
  tableNameKey: Extract<keyof TInnerGroup, string>
  tableDataListKey: Extract<keyof TInnerGroup, string>
  columns: Record<string, ReportColumn<TRow>[]>
  columnSelectorKey: keyof TInnerGroup
  formatter?: Formatter
  totalsConfig?: TotalColumnConfig[]
} & BaseConfig &
  Formatter

export type ReportConfig<TOuterGroup = Record<string, never>, TInnerGroup = Record<string, never>, TRow = unknown> =
  | FlatReportConfig<TRow>
  | GroupedReportConfig<TOuterGroup, TRow>
  | NestedGroupedReportConfig<TOuterGroup, TInnerGroup, TRow>

export type ReportData =
  | { config: FlatReportConfig<Record<string, unknown>>; rows: Record<string, unknown>[] }
  | { config: GroupedReportConfig<Record<string, unknown>, Record<string, unknown>>; rows: Record<string, unknown>[] }
  | {
      config: NestedGroupedReportConfig<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
      rows: Record<string, unknown>[]
    }
