import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { ReportConfigs } from "types/reports/Config"

export const isReportType = (type: unknown): type is ReportType => {
  if (typeof type !== "string") {
    return false
  }

  return Object.keys(ReportConfigs).includes(type)
}
