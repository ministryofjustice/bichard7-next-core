import type { GroupedReportConfig } from "@/types/reports/Config"
import { groupTable } from "@/utils/tables/groupTable"
import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"

export const getGroupReportCsvChunks = async (
  parsedData: Record<string, unknown>[],
  config: GroupedReportConfig<Record<string, unknown>, Record<string, unknown>>,
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
