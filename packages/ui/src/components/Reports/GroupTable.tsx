import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { Table } from "components/Table"
import { isRecord } from "services/reports/utils/isRecord"
import { isRecordArray } from "services/reports/utils/isRecordArray"
import { GroupedReportConfig } from "types/reports/Config"
import { ReportContainer } from "./GroupTable.styles"
import { ReportTableBody } from "./ReportTableBody"
import { ReportTableHeader } from "./ReportTableHeader"
import { Totals } from "./Totals"

interface GroupedTableProps<TOuterGroup extends Record<string, unknown>, TRow extends Record<string, unknown>> {
  config: GroupedReportConfig<TOuterGroup, TRow>
  groups: TOuterGroup[]
}

export const GroupTable = <TOuterGroup extends Record<string, unknown>, TRow extends Record<string, unknown>>({
  config,
  groups
}: GroupedTableProps<TOuterGroup, TRow>) => {
  if (config.structure !== "grouped") {
    return null
  }

  const renderableGroups = groups.map((group) => {
    const groupName = ensureString(group[config.groupNameKey])
    const rawDataList = group[config.dataListKey]
    const totals = isRecord(group.totals) ? group.totals : undefined
    const dataList = isRecordArray(rawDataList) ? rawDataList : []
    const cleanRows = dataList.filter(isRecord)

    return {
      groupName,
      rows: cleanRows as TRow[],
      totals
    }
  })

  return (
    <ReportContainer className="report-container">
      {renderableGroups.map(({ groupName, rows, totals }) => {
        const sectionId = `report-group-${groupName}`

        return (
          <section key={sectionId} aria-labelledby={sectionId}>
            <h3 id={sectionId} className="govuk-heading-m">
              {formatGroupName(config, groupName)}

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
