import { ensureString } from "@/services/reports/utils/ensureString"
import { formatGroupName } from "@/services/reports/utils/formatGroupName"
import { isRecord } from "@/services/reports/utils/isRecord"
import { isRecordArray } from "@/services/reports/utils/isRecordArray"
import type { GroupedReportConfig } from "@/types/reports/Config"
import type ReportTable from "@/types/reports/ReportTable"

export interface GroupedTableProps<TTable extends Record<string, unknown>, TRow extends Record<string, unknown>> {
  config: GroupedReportConfig<TTable, TRow>
  tables: TTable[]
}

export const groupTable = <TTable extends Record<string, unknown>, TRow extends Record<string, unknown>>({
  config,
  tables
}: GroupedTableProps<TTable, TRow>): ReportTable<TRow>[] | null => {
  return tables.map((table) => {
    const tableName = ensureString(table[config.tableNameKey])
    const rawDataList = table[config.tableDataListKey]
    const totals = isRecord(table.totals) ? table.totals : undefined
    const dataList = isRecordArray(rawDataList) ? rawDataList : []
    const cleanRows = dataList.filter(isRecord)

    console.log(cleanRows)

    return {
      formattedTableName: config.formatter ? formatGroupName(config, tableName) : tableName,
      tableName: tableName,
      rows: cleanRows as TRow[],
      totals,
      columns: config.columns
    } as ReportTable<TRow>
  })
}
