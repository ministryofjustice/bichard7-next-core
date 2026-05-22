import type ReportTable from "./ReportTable"

interface ReportTableGroup<TRow extends Record<string, unknown> = Record<string, unknown>> {
  groupName: string
  formattedGroupName: string
  tables: ReportTable<TRow>[]
  totals?: Record<string, unknown>
}

export default ReportTableGroup
