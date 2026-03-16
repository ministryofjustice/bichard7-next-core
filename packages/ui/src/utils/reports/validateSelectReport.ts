import type { ReportType } from "@moj-bichard7/common/types/reports/ReportType"
import { FIELD_REQUIRED } from "./validationMessages"

export const validateSelectReport = (reportType: ReportType | undefined): string | null => {
  return reportType ? null : FIELD_REQUIRED
}
