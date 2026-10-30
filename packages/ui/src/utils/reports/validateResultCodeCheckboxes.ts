import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { AT_LEAST_ONE_CHECKBOX_REQUIRED } from "./validationMessages"

export const validateResultCodeCheckboxes = (reportType: ReportType | undefined, selected: string[]): string | null => {
  if (reportType === "community sentence" && selected.length === 0) {
    return AT_LEAST_ONE_CHECKBOX_REQUIRED
  }

  return null
}
