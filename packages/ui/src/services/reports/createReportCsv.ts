import getMappedColumns from "@/utils/reports/getMappedColumns"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { csvMetadata } from "services/reports/utils/csvMetadata"
import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"
import { isRecord } from "services/reports/utils/isRecord"
import type { ReportConfig } from "types/reports/Config"

export const createReportCsv = async (
  parsedData: Record<string, unknown>[],
  config: ReportConfig,
  reportType: ReportType,
  fromDate: string | null,
  toDate: string | null
): Promise<Blob> => {
  const csvChunks: string[] = ["", csvMetadata(reportType, fromDate, toDate), ""]
  if (config.structure === "nested") {
    parsedData.forEach((group) => {
      const groupName = group[config.outerGroupNameKey]
      const dataList = group[config.outerDataListKey]

      if (!Array.isArray(dataList)) {
        return
      }

      dataList.forEach((innerGroup) => {
        const innerGroupName = innerGroup[config.innerGroupNameKey]
        const innerDataList = innerGroup[config.innerDataListKey]

        if (!Array.isArray(innerDataList)) {
          return
        }

        const mappedColumns = getMappedColumns(config, innerGroup)

        csvChunks.push(
          `"",${escapeCsvCell(groupName)},${escapeCsvCell(innerGroupName)}`,
          mappedColumns.map((col) => escapeCsvCell(col.header)).join(",")
        )

        innerDataList.forEach((rawRow) => {
          if (isRecord(rawRow)) {
            csvChunks.push(mappedColumns.map((col) => escapeCsvCell(rawRow[col.key])).join(","))
          }
        })
      })
    })

    return new Blob([csvChunks.join("\n")], { type: "text/csv;charset=utf-8;" })
  }

  if (config.structure === "grouped") {
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
