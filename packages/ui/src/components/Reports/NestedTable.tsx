import { ReportTable } from "@/features/ReportSelectionFilter/ReportTable"
import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { BaseReportColumn, ReportColumn } from "@/types/reports/Columns"
import { isRecord } from "services/reports/utils/isRecord"
import { isRecordArray } from "services/reports/utils/isRecordArray"
import { FlatReportConfig, NestedGroupedReportConfig, ReportConfig } from "types/reports/Config"
import { ReportContainer } from "./GroupTable.styles"
import { Totals } from "./Totals"

interface NestedTableProps<T> {
  config: ReportConfig
  groups: T[]
}

export const NestedTable = <T extends Record<string, unknown>>({ config, groups }: NestedTableProps<T>) => {
  if (config.structure !== "nested") {
    return null
  }

  const renderableOuterGroups = groups.map((group) => {
    const outerGroupName = ensureString(group[config.outerGroupNameKey])
    const rawDataList = group[config.outerDataListKey]
    const totals = isRecord(group.totals) ? group.totals : undefined
    const dataList = isRecordArray(rawDataList) ? rawDataList : []
    const cleanRows = dataList.filter(isRecord)

    return {
      outerGroupName,
      rows: cleanRows,
      totals
    }
  })

  const getResolvedColumns = <TOuter, TInner, TRow>(
    config: NestedGroupedReportConfig<TOuter, TInner, TRow>,
    innerGroup: Record<string, unknown>
  ): BaseReportColumn[] => {
    const cols = config.columns

    if (config.columnSelectorKey && typeof cols === "object") {
      const selectorValue = String(innerGroup[config.columnSelectorKey as string])
      const dynamicCols = (cols as Record<string, ReportColumn<unknown>[]>)[selectorValue]
      return dynamicCols || []
    }

    return []
  }

  return (
    <ReportContainer className="report-container">
      {renderableOuterGroups.map(({ outerGroupName, rows }) => {
        const outerSectionId = `outer-group-${outerGroupName}`
        const outerSectionBodyId = `outer-group-body-${outerGroupName}`

        const renderableInnerGroups = rows.map((group) => {
          const innerGroupName = ensureString(group[config.innerGroupNameKey])
          const rawDataList = group[config.innerDataListKey]
          const totals = isRecord(group.totals) ? group.totals : undefined
          const dataList = isRecordArray(rawDataList) ? rawDataList : []
          const cleanRows = dataList.filter(isRecord)

          return {
            [config.innerGroupNameKey]: innerGroupName,
            [config.innerDataListKey]: cleanRows,
            [config.columnSelectorKey]: group[config.columnSelectorKey],
            totals
          }
        })

        return (
          <section key={outerSectionId} aria-labelledby={outerSectionId}>
            <h3 id={outerSectionId} className="govuk-heading-m">
              {formatGroupName(config, outerGroupName)}
            </h3>

            <section id={outerSectionBodyId} aria-labelledby={outerSectionId} itemID={"outer-group-body"}>
              {renderableInnerGroups.map((innerGroup, index) => {
                const innerGroupName = ensureString(innerGroup[config.innerGroupNameKey])

                const resolvedColumns = getResolvedColumns(config, innerGroup)

                const innerConfig: FlatReportConfig<Record<string, unknown>> = {
                  structure: "flat",
                  columns: resolvedColumns,
                  endpoint: config.endpoint,
                  reportType: config.reportType
                }

                const innerSectionId = `inner-group-${innerGroupName}-${index}-${outerSectionId}`

                const innerRows = innerGroup[config.innerDataListKey] as unknown as Record<string, unknown>[]

                return (
                  <section key={innerSectionId} aria-labelledby={innerSectionId}>
                    <h3 id={innerSectionId} className="govuk-heading-m">
                      {innerGroupName}

                      <Totals totals={innerGroup.totals} totalsConfig={config.totalsConfig} />
                    </h3>
                    <ReportTable
                      key={innerSectionId}
                      config={innerConfig}
                      rows={innerRows}
                      tableName={innerGroupName}
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
