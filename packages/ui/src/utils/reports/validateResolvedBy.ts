import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { FIELD_REQUIRED } from "./validationMessages"

export const validateResolvedBy = (
  reportType: ReportType | undefined,
  resolvedBy: string[] | undefined,
  canUseTriggerAndExceptionQualityAuditing: boolean
): string | null => {
  if (reportType === "exceptions" && canUseTriggerAndExceptionQualityAuditing) {
    return resolvedBy && resolvedBy.length > 0 ? null : FIELD_REQUIRED
  }

  return null
}
