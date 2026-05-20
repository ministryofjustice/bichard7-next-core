import { ReportTable } from "@/features/ReportSelectionFilter/ReportTable"
import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { ReportColumn } from "@/types/reports/Columns"
import { isRecord } from "services/reports/utils/isRecord"
import { isRecordArray } from "services/reports/utils/isRecordArray"
import { FlatReportConfig, NestedGroupedReportConfig } from "types/reports/Config"
import { ReportContainer } from "./GroupTable.styles"
import { Totals } from "./Totals"

interface NestedTableProps<
  TOuterGroup extends Record<string, unknown>,
  TInnerGroup extends Record<string, unknown>,
  TRow extends Record<string, unknown>
> {
  config: NestedGroupedReportConfig<TOuterGroup, TInnerGroup, TRow>
  groups: TOuterGroup[]
}

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

  const getResolvedColumns = (innerGroup: TInnerGroup): ReportColumn<TRow>[] => {
    const cols = config.columns

    if (Array.isArray(cols)) {
      return cols
    }

    if (config.columnSelectorKey && typeof cols === "object" && cols !== null) {
      const selectorValue = String(innerGroup[config.columnSelectorKey])
      return cols[selectorValue] || []
    }

    return []
  }

  const renderableOuterGroups = groups.map((group) => {
    const outerGroupName = ensureString(group[config.outerGroupNameKey])
    const rawDataList = group[config.outerDataListKey]
    const outerTotals = isRecord(group.totals) ? group.totals : undefined
    const dataList = isRecordArray(rawDataList) ? rawDataList : []
    const cleanInnerGroups = dataList.filter(isRecord)

    return {
      outerGroupName,
      innerGroups: cleanInnerGroups as TInnerGroup[],
      outerTotals
    }
  })

  return (
    <ReportContainer className="report-container">
      {renderableOuterGroups.map(({ outerGroupName, innerGroups, outerTotals }) => {
        const outerSectionId = `outer-group-${outerGroupName}`
        const outerSectionBodyId = `outer-group-body-${outerGroupName}`

        const renderableInnerGroups = innerGroups.map((innerGroup) => {
          const innerGroupName = ensureString(innerGroup[config.innerGroupNameKey])
          const rawDataList = innerGroup[config.innerDataListKey]
          const totals = isRecord(innerGroup.totals) ? innerGroup.totals : undefined
          const dataList = isRecordArray(rawDataList) ? rawDataList : []
          const cleanRows = dataList.filter(isRecord)

          return {
            innerGroupRef: innerGroup,
            innerGroupName,
            rows: cleanRows as TRow[],
            totals
          }
        })

        return (
          <section key={outerSectionId} aria-labelledby={outerSectionId}>
            <h3 id={outerSectionId} className="govuk-heading-m">
              {formatGroupName(config, outerGroupName)}

              <Totals totals={outerTotals} totalsConfig={config.totalsConfig ?? []} />
            </h3>

            <section id={outerSectionBodyId} aria-labelledby={outerSectionBodyId} itemID={"outer-group-body"}>
              {renderableInnerGroups.map(({ innerGroupName, rows, innerGroupRef, totals }, index) => {
                const resolvedColumns = getResolvedColumns(innerGroupRef)

                const innerConfig: FlatReportConfig<TRow> = {
                  structure: "flat",
                  columns: resolvedColumns,
                  endpoint: config.endpoint,
                  reportType: config.reportType,
                  totalsConfig: config.totalsConfig
                }

                const innerSectionId = `inner-group-${innerGroupName}-${index}-${outerSectionId}`

                return (
                  <section key={innerSectionId} aria-labelledby={innerSectionId}>
                    <h3 id={innerSectionId} className="govuk-heading-m">
                      {innerGroupName}

                      <Totals totals={totals} totalsConfig={config.totalsConfig ?? []} />
                    </h3>

                    <ReportTable<TInnerGroup, Record<string, never>, TRow>
                      key={innerSectionId}
                      config={innerConfig}
                      rows={rows}
                      tableName={innerGroupName}
                      nested={true}
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
