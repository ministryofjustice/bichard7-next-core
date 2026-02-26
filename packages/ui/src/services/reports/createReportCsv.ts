import type { ReportConfig } from "types/reports/Config"
import type { ReportType } from "types/reports/ReportType"
import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"
import { isRecord } from "services/reports/utils/isRecord"
import { csvMetadata } from "services/reports/utils/csvMetadata"

export const createReportCsv = async (
  parsedData: Record<string, unknown>[],
  config: ReportConfig,
  reportType: ReportType,
  fromDate: string | null,
  toDate: string | null
): Promise<Blob> => {
  const csvChunks: string[] = ["", csvMetadata(reportType, fromDate, toDate), ""]

  if (config.isGrouped) {
    parsedData.forEach((group) => {
      const groupName = group[config.groupNameKey]
      const dataList = group[config.dataListKey]

      if (!Array.isArray(dataList)) {
        return
      }

      csvChunks.push(`"",${escapeCsvCell(groupName)}`, config.columns.map((col) => escapeCsvCell(col.header)).join(","))

      dataList.forEach((rawRow) => {
        if (isRecord(rawRow)) {
          csvChunks.push(config.columns.map((col) => escapeCsvCell(rawRow[col.key])).join(","))
        }
      })
    })
  } else {
    csvChunks.push(config.columns.map((col) => escapeCsvCell(col.header)).join(","))
    parsedData.forEach((row) => {
      csvChunks.push(config.columns.map((col) => escapeCsvCell(row[col.key])).join(","))
    })
  }

  const csvString = csvChunks.join("\n")

  return new Blob([csvString], { type: "text/csv;charset=utf-8;" })
}
