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

  let table = null

  switch (config.structure) {
    case "flat":
      table = <SimpleTable config={config} rows={rows} tableName={tableName} />
      break
    case "grouped":
      table = <GroupTable config={config} groups={rows} />
      break
  }

  return <StyledReportTable>{table}</StyledReportTable>
}
