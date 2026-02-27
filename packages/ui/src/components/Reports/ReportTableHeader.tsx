import { BaseReportColumn } from "types/reports/Columns"
import { ReportTableHeaderCell } from "components/Reports/ReportTableHeaderCell"
import { ReportTableHeaderRow } from "components/Reports/ReportTableHeaderRow"
import { TableHead, TableRow } from "components/Table"

interface TableHeaderProps {
  columns: BaseReportColumn[]
  groupName?: string
}

export const ReportTableHeader: React.FC<TableHeaderProps> = ({ columns, groupName }) => (
  <TableHead>
    {groupName && (
      <TableRow>
        <ReportTableHeaderCell colSpan={columns.length} scope="colgroup" isGroupHeader>
          {groupName}
        </ReportTableHeaderCell>
      </TableRow>
    )}

    <ReportTableHeaderRow columns={columns} />
  </TableHead>
)
