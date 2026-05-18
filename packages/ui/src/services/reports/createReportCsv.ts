import getMappedColumns from "@/utils/reports/getMappedColumns"
import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { csvMetadata } from "services/reports/utils/csvMetadata"
import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"
import { isRecord } from "services/reports/utils/isRecord"
import type { ReportConfig } from "types/reports/Config"
import { formatGroupName } from "./utils/formatGroupName"

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
      const groupName = group[config.outerGroupNameKey] as string
      const dataList = group[config.outerDataListKey]

      const formattedGroupName = config.formatter ? formatGroupName(config, groupName) : groupName

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
          `"",${escapeCsvCell(formattedGroupName)},${escapeCsvCell(innerGroupName)}`,
          mappedColumns.map((col) => escapeCsvCell(col.header)).join(",")
        )

        innerDataList.forEach((rawRow) => {
          if (isRecord(rawRow)) {
            csvChunks.push(mappedColumns.map((col) => escapeCsvCell(rawRow[col.key])).join(","))
          }
        })
      })
    })
  }

  if (config.structure === "grouped") {
    parsedData.forEach((group) => {
      const groupName = group[config.groupNameKey] as string
      const dataList = group[config.dataListKey]

      const formattedGroupName = config.formatter ? formatGroupName(config, groupName) : groupName

      if (!Array.isArray(dataList)) {
        return
      }

      csvChunks.push(
        `"",${escapeCsvCell(formattedGroupName)}`,
        config.columns.map((col) => escapeCsvCell(col.header)).join(",")
      )

      dataList.forEach((rawRow) => {
        if (isRecord(rawRow)) {
          csvChunks.push(config.columns.map((col) => escapeCsvCell(rawRow[col.key])).join(","))
        }
      })
    })
  }

  if (config.structure === "flat") {
    csvChunks.push(config.columns.map((col) => escapeCsvCell(col.header)).join(","))
    parsedData.forEach((row) => {
      csvChunks.push(config.columns.map((col) => escapeCsvCell(row[col.key])).join(","))
    })
  }

  const csvString = csvChunks.join("\n")

  return new Blob([csvString], { type: "text/csv;charset=utf-8;" })
}
