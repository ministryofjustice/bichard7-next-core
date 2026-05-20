import type { NestedGroupedReportConfig } from "@/types/reports/Config"
import { nestedTable } from "@/utils/tables/nestedTable"
import { escapeCsvCell } from "../utils/escapeCsvCell"

export const getNestedReportCsvChunks = async <
  TOuterGroup extends Record<string, unknown>,
  TInnerGroup extends Record<string, unknown>,
  TRow extends Record<string, unknown>
>(
  parsedData: TOuterGroup[],
  config: NestedGroupedReportConfig<TOuterGroup, TInnerGroup, TRow>,
  csvChunks: string[]
) => {
  const nestedTableData = nestedTable({ config, groups: parsedData })

  nestedTableData?.forEach(({ formattedGroupName, tables }) => {
    tables?.forEach(({ rows, tableName, columns }) => {
      csvChunks.push(
        `"",${escapeCsvCell(formattedGroupName)},${escapeCsvCell(tableName)}`,
        columns.map((col) => escapeCsvCell(col.header)).join(",")
      )

      rows?.forEach((row) => {
        csvChunks.push(columns.map((col) => escapeCsvCell(row[col.key])).join(","))
      })
    })
  })

  return csvChunks
}
