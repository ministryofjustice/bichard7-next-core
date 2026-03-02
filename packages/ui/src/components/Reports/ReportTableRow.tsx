import { BaseReportColumn } from "types/reports/Columns"
import { ReportTableCell } from "components/Reports/ReportTableCell"
import { TableRow } from "components/Table"

interface TableRowProps<T> {
  row: T
  columns: BaseReportColumn[]
}

export const ReportTableRow = <T extends Record<string, unknown>>({ row, columns }: TableRowProps<T>) => (
  <TableRow>
    {columns.map((col) => (
      <ReportTableCell key={String(col.key)} value={row[col.key as keyof T]} />
    ))}
  </TableRow>
)
