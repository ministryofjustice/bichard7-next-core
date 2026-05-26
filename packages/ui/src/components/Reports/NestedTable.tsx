import { FlatReportConfig } from "@/types/reports/Config"
import { nestedTable, NestedTableProps } from "@/utils/tables/nestedTable"
import CollapsibleGroup from "./CollapsibleGroup"
import { ReportContainer } from "./GroupTable.styles"
import { SimpleTable } from "./SimpleTable"
import { Totals } from "./Totals"

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
          <CollapsibleGroup
            groupName={formattedGroupName || groupName}
            indexedKey={groupIndexedKey}
            totals={totals}
            totalsConfig={config.totalsConfig}
          >
            {tables.map(({ tableName, rows, totals, columns }, tableIndex) => {
              const tableIndexedKey = `${tableName}-${tableIndex}`

              const flatTableConfig: FlatReportConfig<TRow> = {
                structure: "flat",
                columns: columns,
                endpoint: config.endpoint,
                reportType: config.reportType
              }

              return (
                <section key={tableIndexedKey} aria-labelledby={tableIndexedKey}>
                  <h4 id={tableIndexedKey} className="govuk-heading-m">
                    {tableName}

                    <Totals totals={totals} totalsConfig={config.totalsConfig ?? []} />
                  </h4>
                  <SimpleTable config={flatTableConfig} rows={rows} tableName={tableName} nested={false} />
                </section>
              )
            })}
          </CollapsibleGroup>
        )
      })}
    </ReportContainer>
  )
}
