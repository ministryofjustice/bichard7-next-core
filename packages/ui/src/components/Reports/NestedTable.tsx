import { ReportTable } from "@/features/ReportSelectionFilter/ReportTable"
import { nestedTable, NestedTableProps } from "@/utils/tables/nestedTable"
import { ReportContainer } from "./GroupTable.styles"
import { Totals } from "./Totals"

export const NestedTable = <
  TOuterGroup extends Record<string, unknown>,
  TInnerGroup extends Record<string, unknown>,
  TRow extends Record<string, unknown>
>({
  config,
  groups
}: NestedTableProps<TOuterGroup, TInnerGroup, TRow>) => {
  if (config.structure !== "nested") {
    return null
  }

  const nestedTableData = nestedTable({ config, groups })

  return (
    <ReportContainer className="report-container">
      {nestedTableData?.map(({ groupName, tables, formattedGroupName }) => {
        const outerSectionId = `outer-group-${groupName}`
        const outerSectionBodyId = `outer-group-body-${groupName}`

        return (
          <section key={outerSectionId} aria-labelledby={outerSectionId}>
            <h3 id={outerSectionId} className="govuk-heading-m">
              {formattedGroupName}
            </h3>

            <section id={outerSectionBodyId} aria-labelledby={outerSectionBodyId} itemID={"outer-group-body"}>
              {tables.map(({ tableName, rows, tableConfig, totals }, index) => {
                const innerSectionId = `inner-group-${tableName}-${index}-${outerSectionId}`

                return (
                  <section key={innerSectionId} aria-labelledby={innerSectionId}>
                    <h4 id={innerSectionId} className="govuk-heading-m">
                      {tableName}

                      <Totals totals={totals} totalsConfig={config.totalsConfig} />
                    </h4>
                    <ReportTable key={innerSectionId} config={tableConfig} rows={rows} tableName={tableName} />
                  </section>
                )
              })}
            </section>
          </section>
        )
      })}
    </ReportContainer>
  )
}
