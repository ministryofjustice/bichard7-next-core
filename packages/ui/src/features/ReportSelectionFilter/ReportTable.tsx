import { ReportConfig } from "types/reports/Config"
import { GroupTable } from "components/Reports/GroupTable"
import { SimpleTable } from "components/Reports/SimpleTable"
import { StyledReportTable } from "./ReportTable.styles"

interface ReportTableProps {
  config: ReportConfig | null
  rows: Record<string, unknown>[]
  tableName: string
}

export const ReportTable: React.FC<ReportTableProps> = ({ config, rows, tableName }) => {
  if (!config) {
    return null
  }

  if (rows.length === 0) {
    return null
  }

  return (
    <StyledReportTable>
      {config.isGrouped ? (
        <GroupTable config={config} groups={rows} />
      ) : (
        <SimpleTable config={config} rows={rows} tableName={tableName} />
      )}
    </StyledReportTable>
  )
}
