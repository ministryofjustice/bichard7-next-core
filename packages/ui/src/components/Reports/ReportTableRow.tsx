import { BaseReportColumn } from "types/reports/Columns"
import { ReportTableCell } from "components/Reports/ReportTableCell"
import { TableRow } from "components/Table"

interface TableRowProps<T> {
  row: T
  columns: BaseReportColumn[]
}

export const ReportTableRow = <T extends Record<string, unknown>>({ row, columns }: TableRowProps<T>) => (
  <TableRow>
    {columns.map((col) => {
      const cellValue = row[col.key as keyof T]
      let stringOrElement: React.JSX.Element | string = String(cellValue ?? "-")

      if (col.key === "defendantName") {
        stringOrElement = (
          <a href={`/bichard/court-cases/${row.errorId}`} className={"govuk-link"} target={"_blank"}>
            {cellValue as string}
          </a>
        )
      }

      return <ReportTableCell key={String(col.key)} value={stringOrElement} />
    })}
  </TableRow>
)
