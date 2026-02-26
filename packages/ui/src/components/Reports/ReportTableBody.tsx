import { BaseReportColumn } from "types/reports/Columns"
import { ReportTableRow } from "components/Reports/ReportTableRow"
import { StyledReportTableBody } from "components/Reports/ReportTableBody.styles"

interface TableBodyProps<T> {
  rows: T[]
  columns: BaseReportColumn[]
}

export const ReportTableBody = <T extends Record<string, unknown>>({ rows, columns }: TableBodyProps<T>) => (
  <StyledReportTableBody>
    {rows.map((row, rowIdx) => (
      <ReportTableRow key={`${row.asn}-${rowIdx}`} row={row} columns={columns} />
    ))}
  </StyledReportTableBody>
)
