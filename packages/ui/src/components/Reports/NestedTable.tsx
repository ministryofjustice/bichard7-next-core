import { ReportTable } from "@/features/ReportSelectionFilter/ReportTable"
import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { isRecord } from "services/reports/utils/isRecord"
import { isRecordArray } from "services/reports/utils/isRecordArray"
import { FlatReportConfig, NestedGroupedReportConfig, ReportConfig } from "types/reports/Config"
import { ReportContainer } from "./GroupTable.styles"
import { Totals } from "./Totals"

interface NestedTableProps<T> {
  config: ReportConfig
  groups: T[]
}
type RecordWithIndex = Record<string, unknown> & { columnsIndex: number }

export const NestedTable = <T extends Record<string, unknown>>({ config, groups }: NestedTableProps<T>) => {
  if (config.structure !== "nested") {
    return null
  }

  const renderableOuterGroups = groups.map((group) => {
    const outerGroupName = ensureString(group[config.outerGroupNameKey])
    console.log("--------------------")
    console.log(group)
    const cleanRows = config.outerDataListKeys.flatMap((key, columnsIndex) => {
      const innerGroups = group[key]
      if (!isRecordArray(innerGroups)) {
        return []
      }

      return innerGroups.filter(isRecord).map(
        (innerGroup): RecordWithIndex => ({
          ...innerGroup,
          columnsIndex
        })
      )
    })
    console.log(cleanRows)

    return {
      outerGroupName,
      rows: cleanRows
    }
  })

  const getChildConfig = <TOuter, TInner, TRow>(
    parentConfig: NestedGroupedReportConfig<TOuter, TInner, TRow>,
    columnsIndex: number
  ): FlatReportConfig<TRow> => {
    return {
      structure: "flat",
      columns: parentConfig.columns[columnsIndex],
      endpoint: parentConfig.endpoint,
      reportType: parentConfig.reportType
    }
  }

  return (
    <ReportContainer className="report-container">
      {renderableOuterGroups.map(({ outerGroupName, rows }) => {
        const sectionId = `outer-group-${outerGroupName}`

        const renderableInnerGroups = rows.map((group) => {
          const innerGroupName = ensureString(group[config.innerGroupNameKey])
          const rawDataList = group[config.innerDataListKey]
          const totals = isRecord(group.totals) ? group.totals : undefined
          const dataList = isRecordArray(rawDataList) ? rawDataList : []
          const cleanRows = dataList.filter(isRecord)

          return {
            [config.innerGroupNameKey]: innerGroupName,
            [config.innerDataListKey]: cleanRows,
            totals,
            columnsIndex: (group as RecordWithIndex).columnsIndex
          }
        })

        return (
          <>
            <h3 id={sectionId} className="govuk-heading-m">
              {formatGroupName(config, outerGroupName)}
            </h3>

            {renderableInnerGroups.map((innerGroup) => {
              const innerConfig = getChildConfig(config, innerGroup.columnsIndex)

              const sectionId = `inner-group-${innerGroup.innerGroupName}`

              const innerGroupName = ensureString(innerGroup[config.innerGroupNameKey])
              const innerRows = innerGroup[config.innerDataListKey] as unknown as Record<string, unknown>[]

              return (
                <>
                  <h3 id={sectionId} className="govuk-heading-m">
                    {innerGroupName}

                    <Totals totals={innerGroup.totals} totalsConfig={config.totalsConfig} />
                  </h3>
                  <ReportTable key={sectionId} config={innerConfig} rows={innerRows} tableName={innerGroupName} />{" "}
                </>
              )
            })}
          </>
        )
      })}
    </ReportContainer>
  )
}
