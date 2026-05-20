import type { AutomatedReportType } from "@moj-bichard7/common/types/reports/AutomatedReportType"
import { AUTOMATED_REPORT_TYPE_MAP } from "@moj-bichard7/common/types/reports/AutomatedReportType"

export const xlsxFilename = (automatedReportType: AutomatedReportType) => {
  const formattedType = AUTOMATED_REPORT_TYPE_MAP[automatedReportType].replaceAll(" ", "-")

  return `${formattedType}.xlsx`
}
