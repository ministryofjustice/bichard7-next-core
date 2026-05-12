import { ReportTable } from "@/features/ReportSelectionFilter/ReportTable"
import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { isRecord } from "services/reports/utils/isRecord"
import { isRecordArray } from "services/reports/utils/isRecordArray"
import { FlatReportConfig, NestedGroupedReportConfig, ReportConfig } from "types/reports/Config"
import { ReportContainer } from "./GroupTable.styles"

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
    const rawDataLists = config.outerDataListKeys.map((key) => group[key])
    const dataList = rawDataLists.flatMap((list) => (isRecordArray(list) ? list : []))
    const cleanRows = dataList.filter(isRecord)

    return {
      outerGroupName,
      rows: cleanRows
    }
  })

  const getChildConfig = <TOuter, TInner, TRow>(
    parentConfig: NestedGroupedReportConfig<TOuter, TInner, TRow>
  ): FlatReportConfig<TRow> => {
    return {
      structure: "flat",
      //groupNameKey: parentConfig.innerGroupNameKey,
      //dataListKey: parentConfig.innerDataListKey,
      columns: parentConfig.columns,
      endpoint: parentConfig.endpoint,
      reportType: parentConfig.reportType
      //formatter: parentConfig.formatter,
      //totalsConfig: parentConfig.totalsConfig
    }
  }

  return (
    <ReportContainer className="report-container">
      {renderableOuterGroups.map(({ outerGroupName, rows }) => {
        const sectionId = `outer-group-${outerGroupName}`

        console.log(rows)

        const renderableInnerGroups = rows.map((group) => {
          const innerGroupName = ensureString(group[config.innerGroupNameKey])
          const rawDataList = group[config.innerDataListKey]
          const dataList = isRecordArray(rawDataList) ? rawDataList : []
          const cleanRows = dataList.filter(isRecord)

          return {
            [config.innerGroupNameKey]: innerGroupName,
            [config.innerDataListKey]: cleanRows
          }
        })

        return (
          <>
            <h3 id={sectionId} className="govuk-heading-m">
              {formatGroupName(config, outerGroupName)}
            </h3>

            {renderableInnerGroups.map((innerGroup) => {
              const innerConfig = getChildConfig(config)

              const sectionId = `inner-group-${innerGroup.innerGroupName}`

              const innerGroupName = ensureString(innerGroup[config.innerGroupNameKey])
              const innerRows = innerGroup[config.innerDataListKey] as unknown as Record<string, unknown>[]

              return <ReportTable key={sectionId} config={innerConfig} rows={innerRows} tableName={innerGroupName} />
            })}
          </>
        )
      })}
    </ReportContainer>
  )
}
