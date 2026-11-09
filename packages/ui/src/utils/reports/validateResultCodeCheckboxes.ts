import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { TRPR0031_RESULT_CODES } from "@moj-bichard7/common/utils/triggerConstants"
import { AT_LEAST_ONE_CHECKBOX_REQUIRED } from "./validationMessages"

export const validateResultCodeCheckboxes = (reportType: ReportType | undefined, selected: string[]): string | null => {
  const filteredResultCodes = TRPR0031_RESULT_CODES.filter((resultCode) => selected.includes(resultCode.toString()))
  if (reportType === "community sentence" && filteredResultCodes.length === 0) {
    return AT_LEAST_ONE_CHECKBOX_REQUIRED
  }

  return null
}
