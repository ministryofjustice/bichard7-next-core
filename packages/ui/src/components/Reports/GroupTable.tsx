import { GroupedTableProps, groupTable } from "@/utils/tables/groupTable"
import { Table } from "components/Table"
import { ReportContainer } from "./GroupTable.styles"
import { ReportTableBody } from "./ReportTableBody"
import { ReportTableHeader } from "./ReportTableHeader"
import { Totals } from "./Totals"

export const GroupTable = <TOuterGroup extends Record<string, unknown>, TRow extends Record<string, unknown>>({
  config,
  groups
}: GroupedTableProps<TOuterGroup, TRow>) => {
  if (config.structure !== "grouped") {
    return null
  }

  const groupTableData = groupTable({ config, groups })

  return (
    <ReportContainer className="report-container">
      {groupTableData?.map(({ tableName, formattedTableName, rows, totals }) => {
        const sectionId = `report-group-${formattedTableName}`

        return (
          <section key={sectionId} aria-labelledby={sectionId}>
            <h3 id={sectionId} className="govuk-heading-m">
              {formattedTableName}

              <Totals totals={totals} totalsConfig={config.totalsConfig} />
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
