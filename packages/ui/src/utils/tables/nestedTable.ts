import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { getMappedColumns } from "@/services/reports/utils/getMappedColumns"
import { isRecord } from "@/services/reports/utils/isRecord"
import { isRecordArray } from "@/services/reports/utils/isRecordArray"
import type { FlatReportConfig, ReportConfig } from "@/types/reports/Config"
import type ReportTable from "@/types/reports/ReportTable"
import type { default as ReportTableGroup } from "@/types/reports/ReportTableGroup"

export interface NestedTableProps<TOuterGroup> {
  config: ReportConfig
  groups: TOuterGroup[]
}

export const nestedTable = <TOuterGroup extends Record<string, unknown>>({
  config,
  groups
}: NestedTableProps<TOuterGroup>): ReportTableGroup[] | null => {
  if (config.structure !== "nested") {
    return null
  }

  return groups.filter(isRecord).map((group) => {
    const groupName = ensureString(group[config.groupNameKey])
    const rawGroupDataList = group[config.groupDataListKey]
    const groupTotals = isRecord(group.totals) ? group.totals : undefined
    const groupDataList = isRecordArray(rawGroupDataList) ? rawGroupDataList : []
    const cleanTables = groupDataList.filter(isRecord)

    const tables = cleanTables.map((table) => {
      const tableName = ensureString(table[config.tableNameKey])
      const rawTableDataList = table[config.tableDataListKey]
      const tableTotals = isRecord(table.totals) ? table.totals : undefined
      const tableDataList = isRecordArray(rawTableDataList) ? rawTableDataList : []
      const cleanTableRows = tableDataList.filter(isRecord)

      const mappedColumns = getMappedColumns(config, table)

      const tableConfig: FlatReportConfig<Record<string, unknown>> = {
        structure: "flat",
        columns: mappedColumns,
        endpoint: config.endpoint,
        reportType: config.reportType
      }

      return {
        tableName,
        rows: cleanTableRows,
        totals: tableTotals,
        tableConfig,
        columns: mappedColumns
      } as ReportTable
    })

    return {
      groupName,
      formattedGroupName: config.formatter ? formatGroupName(config, groupName) : groupName,
      totals: groupTotals,
      tables
    } as ReportTableGroup
  })
}
