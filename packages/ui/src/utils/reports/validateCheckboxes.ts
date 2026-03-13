import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { AT_LEAST_ONE_CHECKBOX_REQUIRED } from "./validationMessages"

export const validateCheckboxes = (
  reportType: ReportType | undefined,
  triggers: boolean,
  exceptions: boolean
): string | null => {
  if (reportType === "exceptions" && !triggers && !exceptions) {
    return AT_LEAST_ONE_CHECKBOX_REQUIRED
  }

  return null
}
