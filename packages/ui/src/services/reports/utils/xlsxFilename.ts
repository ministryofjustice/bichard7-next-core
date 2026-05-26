import type { AutomatedReportType } from "@moj-bichard7/common/types/reports/AutomatedReportType"
import { AUTOMATED_REPORT_TYPE_MAP } from "@moj-bichard7/common/types/reports/AutomatedReportType"

export const xlsxFilename = (automatedReportType: AutomatedReportType) => {
  const reportName = AUTOMATED_REPORT_TYPE_MAP[automatedReportType]

  const formattedType = reportName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")

  return `${formattedType}.xlsx`
}
