import { ReportTable } from "@/features/ReportSelectionFilter/ReportTable"
import { nestedTable, NestedTableProps } from "@/utils/tables/nestedTable"
import { ReportContainer } from "./GroupTable.styles"
import { Totals } from "./Totals"

export const NestedTable = <TOuterGroup extends Record<string, unknown>>({
  config,
  groups
}: NestedTableProps<TOuterGroup>) => {
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
              {tables.map((innerGroup, index) => {
                const tableName = innerGroup.tableName

                const innerSectionId = `inner-group-${tableName}-${index}-${outerSectionId}`

                const innerRows = innerGroup[config.innerDataListKey] as unknown as Record<string, unknown>[]

                return (
                  <section key={innerSectionId} aria-labelledby={innerSectionId}>
                    <h4 id={innerSectionId} className="govuk-heading-m">
                      {tableName}

                      <Totals totals={innerGroup.totals} totalsConfig={config.totalsConfig} />
                    </h4>
                    <ReportTable
                      key={innerSectionId}
                      config={innerGroup.tableConfig}
                      rows={innerRows}
                      tableName={innerGroup.tableName}
                    />
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
