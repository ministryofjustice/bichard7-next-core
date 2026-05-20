import type { BaseReportColumn } from "./Columns"
import type { FlatReportConfig } from "./Config"

interface ReportTable {
  formattedTableName?: string
  tableName: string
  rows: Record<string, unknown>[]
  totals?: Record<string, unknown>
  tableConfig: FlatReportConfig<Record<string, unknown>>
  columns: BaseReportColumn[]
}

export default ReportTable
