import type ReportTable from "./ReportTable"

interface ReportTableGroup {
  groupName: string
  formattedGroupName: string
  totals?: Record<string, unknown>
  tables: ReportTable[]
}

export default ReportTableGroup
