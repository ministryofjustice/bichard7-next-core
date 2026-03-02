import { StyledReportTableHeaderCell } from "components/Reports/ReportTableHeaderCell.styles"

interface TableHeaderCellProps {
  children: React.ReactNode
  colSpan?: number
  isGroupHeader?: boolean
}

export const ReportTableHeaderCell: React.FC<TableHeaderCellProps> = ({ children, colSpan, isGroupHeader }) => (
  <StyledReportTableHeaderCell isGroupHeader={isGroupHeader} colSpan={colSpan}>
    {children}
  </StyledReportTableHeaderCell>
)
