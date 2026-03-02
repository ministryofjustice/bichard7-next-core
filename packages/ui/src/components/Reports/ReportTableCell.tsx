import { StyledReportTableCell } from "./ReportTableCell.styles"
import { JSX } from "react"

interface TableCellProps {
  value: string | JSX.Element
}

export const ReportTableCell: React.FC<TableCellProps> = ({ value }) => (
  <StyledReportTableCell>{value}</StyledReportTableCell>
)
