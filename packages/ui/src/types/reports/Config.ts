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

export type GroupedReportConfig<TTable, TRow> = {
  structure: Extract<ReportStructure, "grouped">
  tableNameKey: Extract<keyof TTable, string>
  tableDataListKey: Extract<keyof TTable, string>
  columns: ReportColumn<TRow>[]
  formatter?: Formatter
  totalsConfig?: TotalColumnConfig[]
} & BaseConfig &
  Formatter

export type ColumnResolver<T> = (data: unknown) => ReportColumn<T>[]

export type NestedGroupedReportConfig<TGroup, TTable, TRow> = {
  structure: Extract<ReportStructure, "nested">
  groupNameKey: Extract<keyof TGroup, string>
  groupDataListKey: Extract<keyof TGroup, string>
  tableNameKey: Extract<keyof TTable, string>
  tableDataListKey: Extract<keyof TTable, string>
  columns: Record<string, ReportColumn<TRow>[]>
  columnSelectorKey: keyof TTable
  formatter?: Formatter
  totalsConfig?: TotalColumnConfig[]
} & BaseConfig &
  Formatter

export type ReportConfig<TGroup = Record<string, never>, TTable = Record<string, never>, TRow = unknown> =
  FlatReportConfig<TRow> | GroupedReportConfig<TGroup, TRow> | NestedGroupedReportConfig<TGroup, TTable, TRow>

export type ReportData =
  | { config: FlatReportConfig<Record<string, unknown>>; rows: Record<string, unknown>[] }
  | { config: GroupedReportConfig<Record<string, unknown>, Record<string, unknown>>; rows: Record<string, unknown>[] }
  | {
      config: NestedGroupedReportConfig<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>
      rows: Record<string, unknown>[]
    }
