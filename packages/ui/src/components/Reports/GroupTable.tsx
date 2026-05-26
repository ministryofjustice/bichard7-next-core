import { GroupedTableProps, groupTable } from "@/utils/tables/groupTable"
import { Table } from "components/Table"
import CollapsibleTable from "./CollapsibleTable"
import { ReportContainer } from "./GroupTable.styles"
import { ReportTableBody } from "./ReportTableBody"
import { ReportTableHeader } from "./ReportTableHeader"

export const GroupTable = <TTable extends Record<string, unknown>, TRow extends Record<string, unknown>>({
  config,
  tables
}: GroupedTableProps<TTable, TRow>) => {
  const groupTableData = groupTable({ config, tables })

  return (
    <ReportContainer className="report-container">
      {groupTableData?.map(({ tableName, formattedTableName, rows, totals }, index) => {
        const indexedKey = `report-group-${formattedTableName}-${index}`

        return (
          <CollapsibleTable
            tableName={formattedTableName || tableName}
            totals={totals}
            totalsConfig={config.totalsConfig}
            indexedKey={indexedKey}
          >
            <Table>
              <caption className="govuk-visually-hidden">{`Report table for ${formattedTableName}`}</caption>
              <ReportTableHeader columns={config.columns} />
              <ReportTableBody rows={rows} columns={config.columns} />
            </Table>
          </CollapsibleTable>
        )
      })}
    </ReportContainer>
  )
}
