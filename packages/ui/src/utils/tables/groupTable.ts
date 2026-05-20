import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { isRecord } from "@/services/reports/utils/isRecord"
import { isRecordArray } from "@/services/reports/utils/isRecordArray"
import type { GroupedReportConfig } from "@/types/reports/Config"
import type ReportTable from "@/types/reports/ReportTable"

export interface GroupedTableProps<TOuterGroup extends Record<string, unknown>, TRow extends Record<string, unknown>> {
  config: GroupedReportConfig<TOuterGroup, TRow>
  groups: TOuterGroup[]
}

export const groupTable = <TOuterGroup extends Record<string, unknown>, TRow extends Record<string, unknown>>({
  config,
  groups
}: GroupedTableProps<TOuterGroup, TRow>): ReportTable<TRow>[] | null => {
  if (config.structure !== "grouped") {
    return null
  }

  return groups.map((group) => {
    const groupName = ensureString(group[config.groupNameKey])
    const rawDataList = group[config.dataListKey]
    const totals = isRecord(group.totals) ? group.totals : undefined
    const dataList = isRecordArray(rawDataList) ? rawDataList : []
    const cleanRows = dataList.filter(isRecord)

    return {
      formattedTableName: config.formatter ? formatGroupName(config, groupName) : groupName,
      tableName: groupName,
      rows: cleanRows as TRow[],
      totals,
      columns: config.columns,
      tableConfig: {
        structure: "flat",
        columns: config.columns,
        endpoint: config.endpoint,
        reportType: config.reportType
      }
    } as ReportTable<TRow>
  })
}
