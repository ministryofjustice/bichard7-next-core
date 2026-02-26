import { StyledReportTableCell } from "./ReportTableCell.styles"

interface TableCellProps {
  value: unknown
}

export const ReportTableCell: React.FC<TableCellProps> = ({ value }) => (
  <StyledReportTableCell>{value !== undefined && value !== null ? String(value) : "-"}</StyledReportTableCell>
)
