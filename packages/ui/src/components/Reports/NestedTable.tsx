import { FlatReportConfig } from "@/types/reports/Config"
import { nestedTable, NestedTableProps } from "@/utils/tables/nestedTable"
import CollapsibleContainer from "./CollapsibleContainer"
import { ReportContainer } from "./GroupTable.styles"
import { SimpleTable } from "./SimpleTable"

export const NestedTable = <
  TGroup extends Record<string, unknown>,
  TTable extends Record<string, unknown>,
  TRow extends Record<string, unknown>
>({
  config,
  groups
}: NestedTableProps<TGroup, TTable, TRow>) => {
  if (config.structure !== "nested") {
    return null
  }

  const nestedTableData = nestedTable({ config, groups })

  return (
    <ReportContainer className="report-container">
      {nestedTableData?.map(({ groupName, tables, formattedGroupName, totals }, groupIndex) => {
        const groupIndexedKey = `report-group-${groupName}-${groupIndex}`

        return (
          <CollapsibleContainer
            key={groupIndexedKey}
            headingName={formattedGroupName || groupName}
            indexedKey={groupIndexedKey}
            totals={totals}
            totalsConfig={config.totalsConfig}
            headerType="h3"
          >
            {tables.map(({ tableName, rows, totals, columns }, tableIndex) => {
              const tableIndexedKey = `table-${tableName}-${tableIndex}`

              const flatTableConfig: FlatReportConfig<TRow> = {
                structure: "flat",
                columns: columns,
                endpoint: config.endpoint,
                reportType: config.reportType
              }

              return (
                <CollapsibleContainer
                  headingName={tableName}
                  indexedKey={tableIndexedKey}
                  headerType={"h4"}
                  totals={totals}
                  totalsConfig={config.totalsConfig}
                >
                  <SimpleTable config={flatTableConfig} rows={rows} tableName={tableName} nested={false} />
                </CollapsibleContainer>
              )
            })}
          </CollapsibleContainer>
        )
      })}
    </ReportContainer>
  )
}
