import type { CaseRowForReport } from "@moj-bichard7/common/types/Case"

import { convertCaseToCaseReportDto } from "../../dto/convertCaseToDto"

export const processExceptions = (caseRowForReport: CaseRowForReport) => {
  return convertCaseToCaseReportDto(caseRowForReport)
}
