import { ReportTableCell } from "components/Reports/ReportTableCell"
import { TableRow } from "components/Table"
import { BaseReportColumn } from "types/reports/Columns"
import ExpandableCell from "./ExpandableCell"

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
      } else if (col.key === "fullName" && row.fullName === "Unknown User" && row.username) {
        stringOrElement = row.username as string
      }

      return <ReportTableCell key={String(col.key)} value={<ExpandableCell content={stringOrElement} />} />
    })}
  </TableRow>
)
