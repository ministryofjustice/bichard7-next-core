import type { BaseReportColumn } from "./Columns"

interface ReportTable<TRow extends Record<string, unknown>> {
  formattedTableName?: string
  tableName: string
  rows: TRow[]
  totals?: Record<string, unknown>
  columns: BaseReportColumn<TRow>[]
}

export default ReportTable
