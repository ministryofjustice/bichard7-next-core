import { StyledReportTableHeaderCell } from "components/Reports/ReportTableHeaderCell.styles"

interface TableHeaderCellProps {
  children: React.ReactNode
  colSpan?: number
  scope?: string
  isGroupHeader?: boolean
}

export const ReportTableHeaderCell: React.FC<TableHeaderCellProps> = ({ children, colSpan, isGroupHeader, scope }) => (
  <StyledReportTableHeaderCell isGroupHeader={isGroupHeader} colSpan={colSpan} scope={scope}>
    {children}
  </StyledReportTableHeaderCell>
)
