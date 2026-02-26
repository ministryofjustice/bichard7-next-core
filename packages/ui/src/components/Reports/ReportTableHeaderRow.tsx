import { BaseReportColumn } from "types/reports/Columns"
import { ReportTableHeaderCell } from "components/Reports/ReportTableHeaderCell"
import { TableRow } from "components/Table"

interface TableHeaderRowProps {
  columns: BaseReportColumn[]
}

export const ReportTableHeaderRow: React.FC<TableHeaderRowProps> = ({ columns }) => (
  <TableRow>
    {columns.map((col) => (
      <ReportTableHeaderCell key={String(col.key)}>{col.header}</ReportTableHeaderCell>
    ))}
  </TableRow>
)
