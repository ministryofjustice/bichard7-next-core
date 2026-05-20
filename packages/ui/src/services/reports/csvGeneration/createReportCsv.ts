import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { csvMetadata } from "services/reports/utils/csvMetadata"
import type { ReportData } from "types/reports/Config"
import { getFlatReportCsvChunks } from "./getFlatReportCsvChunks"
import { getGroupReportCsvChunks } from "./getGroupReportCsvChunks"
import { getNestedReportCsvChunks } from "./getNestedReportCsvChunks"

export const createReportCsv = async (
  reportData: ReportData,
  reportType: ReportType,
  fromDate: string | null,
  toDate: string | null
): Promise<Blob> => {
  let csvChunks: string[] = ["", csvMetadata(reportType, fromDate, toDate), ""]

  const { config, rows } = reportData

  if (config.structure === "nested") {
    csvChunks = await getNestedReportCsvChunks(rows, config, csvChunks)
  }

  if (config.structure === "grouped") {
    csvChunks = await getGroupReportCsvChunks(rows, config, csvChunks)
  }

  if (config.structure === "flat") {
    csvChunks = await getFlatReportCsvChunks(rows, config, csvChunks)
  }

  const csvString = csvChunks.join("\n")

  return new Blob([csvString], { type: "text/csv;charset=utf-8;" })
}
