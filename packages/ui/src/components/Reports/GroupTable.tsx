import { GroupedTableProps, groupTable } from "@/utils/tables/groupTable"
import { Table } from "components/Table"
import { ReportContainer } from "./GroupTable.styles"
import { ReportTableBody } from "./ReportTableBody"
import { ReportTableHeader } from "./ReportTableHeader"
import { Totals } from "./Totals"

export const GroupTable = <TTable extends Record<string, unknown>, TRow extends Record<string, unknown>>({
  config,
  tables
}: GroupedTableProps<TTable, TRow>) => {
  const groupTableData = groupTable({ config, tables })

  return (
    <ReportContainer className="report-container">
      {groupTableData?.map(({ tableName, formattedTableName, rows, totals }) => {
        const sectionId = `report-group-${formattedTableName}`

        return (
          <section key={sectionId} aria-labelledby={sectionId}>
            <h3 id={sectionId} className="govuk-heading-m">
              {formattedTableName}

              <Totals totals={totals} totalsConfig={config.totalsConfig ?? []} flat={false} />
            </h3>

            <Table>
              <caption className="govuk-visually-hidden">{`Report table for ${tableName}`}</caption>
              <ReportTableHeader columns={config.columns} />
              <ReportTableBody rows={rows} columns={config.columns} />
            </Table>
          </section>
        )
      })}
    </ReportContainer>
  )
}
