import type { GroupedReportConfig } from "@/types/reports/Config"
import { groupTable } from "@/utils/tables/groupTable"
import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"

export const getGroupReportCsvChunks = async <
  TInnerGroup extends Record<string, unknown>,
  TRow extends Record<string, unknown>
>(
  parsedData: TInnerGroup[],
  config: GroupedReportConfig<TInnerGroup, TRow>,
  csvChunks: string[]
) => {
  const groupTableData = groupTable({ config, groups: parsedData })

  groupTableData?.forEach(({ rows, formattedTableName, columns }) => {
    csvChunks.push(`"",${escapeCsvCell(formattedTableName)}`, columns.map((col) => escapeCsvCell(col.header)).join(","))

    rows?.forEach((row) => {
      csvChunks.push(columns.map((col) => escapeCsvCell(row[col.key])).join(","))
    })
  })

  return csvChunks
}
