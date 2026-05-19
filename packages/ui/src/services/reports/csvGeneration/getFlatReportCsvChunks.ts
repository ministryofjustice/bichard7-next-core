import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"
import type { FlatReportConfig } from "types/reports/Config"

export const getFlatReportCsvChunks = async (
  parsedData: Record<string, unknown>[],
  config: FlatReportConfig<Record<string, unknown>>,
  csvChunks: string[]
) => {
  csvChunks.push(config.columns.map((col) => escapeCsvCell(col.header)).join(","))
  parsedData.forEach((row) => {
    csvChunks.push(config.columns.map((col) => escapeCsvCell(row[col.key])).join(","))
  })

  return csvChunks
}
