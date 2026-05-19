import { GroupedTableProps, groupTable } from "@/utils/tables/groupTable"
import { Table } from "components/Table"
import { ReportContainer } from "./GroupTable.styles"
import { ReportTableBody } from "./ReportTableBody"
import { ReportTableHeader } from "./ReportTableHeader"
import { Totals } from "./Totals"

export const MultiTable = <TGroup extends Record<string, unknown>>({ config, groups }: GroupedTableProps<TGroup>) => {
  if (config.structure !== "grouped") {
    return null
  }

  const renderableGroups = groupTable({ config, groups })

  return (
    <ReportContainer className="report-container">
      {renderableGroups?.map(({ groupName, formattedGroupName, rows, totals }) => {
        const sectionId = `report-group-${formattedGroupName}`

        return (
          <section key={sectionId} aria-labelledby={sectionId}>
            <h3 id={sectionId} className="govuk-heading-m">
              {formattedGroupName}

              <Totals totals={totals} totalsConfig={config.totalsConfig} />
            </h3>

            <Table>
              <caption className="govuk-visually-hidden">{`Report table for ${groupName}`}</caption>
              <ReportTableHeader columns={config.columns} />
              <ReportTableBody rows={rows} columns={config.columns} />
            </Table>
          </section>
        )
      })}
    </ReportContainer>
  )
}
