import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { csvMetadata } from "services/reports/utils/csvMetadata"
import type {
  FlatReportConfig,
  GroupedReportConfig,
  NestedGroupedReportConfig,
  ReportConfig
} from "types/reports/Config"
import { getFlatReportCsvChunks } from "./getFlatReportCsvChunks"
import { getGroupReportCsvChunks } from "./getGroupReportCsvChunks"
import { getNestedReportCsvChunks } from "./getNestedReportCsvChunks"

export const createReportCsv = async (
  parsedData: Record<string, unknown>[],
  config: ReportConfig,
  reportType: ReportType,
  fromDate: string | null,
  toDate: string | null
): Promise<Blob> => {
  let csvChunks: string[] = ["", csvMetadata(reportType, fromDate, toDate), ""]
  if (config.structure === "nested") {
    csvChunks = await getNestedReportCsvChunks(
      parsedData,
      config as NestedGroupedReportConfig<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>>,
      csvChunks
    )
  }

  if (config.structure === "grouped") {
    csvChunks = await getGroupReportCsvChunks(
      parsedData,
      config as GroupedReportConfig<Record<string, unknown>, Record<string, unknown>>,
      csvChunks
    )
  }

  if (config.structure === "flat") {
    csvChunks = await getFlatReportCsvChunks(parsedData, config as FlatReportConfig<Record<string, unknown>>, csvChunks)
  }

  const csvString = csvChunks.join("\n")

  return new Blob([csvString], { type: "text/csv;charset=utf-8;" })
}
