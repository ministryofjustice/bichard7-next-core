import type { BaseReportColumn } from "./Columns"
import type { FlatReportConfig } from "./Config"

interface ReportTable<TRow extends Record<string, unknown>> {
  formattedTableName?: string
  tableName: string
  rows: TRow[]
  totals?: Record<string, unknown>
  tableConfig: FlatReportConfig<Record<string, unknown>>
  columns: BaseReportColumn<TRow>[]
}

export default ReportTable
