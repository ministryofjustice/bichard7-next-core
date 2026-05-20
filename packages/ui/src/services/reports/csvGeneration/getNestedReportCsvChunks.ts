import type { NestedGroupedReportConfig } from "@/types/reports/Config"
import { nestedTable } from "@/utils/tables/nestedTable"
import { escapeCsvCell } from "../utils/escapeCsvCell"

export const getNestedReportCsvChunks = async (
  parsedData: Record<string, unknown>[],
  config: NestedGroupedReportConfig<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>,
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
