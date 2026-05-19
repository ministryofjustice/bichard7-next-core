import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { getMappedColumns } from "@/services/reports/utils/getMappedColumns"
import { isRecord } from "@/services/reports/utils/isRecord"
import { isRecordArray } from "@/services/reports/utils/isRecordArray"
import type { FlatReportConfig, ReportConfig } from "@/types/reports/Config"

export interface NestedTableProps<TOuterGroup> {
  config: ReportConfig
  groups: TOuterGroup[]
}

export const nestedTable = <TOuterGroup extends Record<string, unknown>>({
  config,
  groups
}: NestedTableProps<TOuterGroup>) => {
  if (config.structure !== "nested") {
    return null
  }

  return groups.map((group) => {
    const groupName = ensureString(group[config.outerGroupNameKey])
    const rawDataList = group[config.outerDataListKey]
    const totals = isRecord(group.totals) ? group.totals : undefined
    const dataList = isRecordArray(rawDataList) ? rawDataList : []
    const cleanRows = dataList.filter(isRecord)

    const tables = cleanRows.map((innerGroup) => {
      const tableName = ensureString(innerGroup[config.innerGroupNameKey])
      const rawDataList = innerGroup[config.innerDataListKey]
      const totals = isRecord(innerGroup.totals) ? innerGroup.totals : undefined
      const dataList = isRecordArray(rawDataList) ? rawDataList : []
      const cleanTableRows = dataList.filter(isRecord)

      const mappedColumns = getMappedColumns(config, innerGroup)

      const tableConfig: FlatReportConfig<Record<string, unknown>> = {
        structure: "flat",
        columns: mappedColumns,
        endpoint: config.endpoint,
        reportType: config.reportType
      }

      return {
        tableName,
        [config.innerDataListKey]: cleanTableRows,
        [config.columnSelectorKey]: group[config.columnSelectorKey as string],
        totals,
        tableConfig
      }
    })

    return {
      formattedGroupName: config.formatter ? formatGroupName(config, groupName) : groupName,
      groupName,
      totals,
      tables
    }
  })
}
