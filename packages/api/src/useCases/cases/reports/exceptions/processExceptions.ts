import type { CaseForReport, CaseRowForReport } from "@moj-bichard7/common/types/Reports"

import { convertCaseToCaseReportDto } from "../../../dto/convertCaseToDto"

export const processExceptions = (caseRowForReport: CaseRowForReport): CaseForReport => {
  return convertCaseToCaseReportDto(caseRowForReport)
}
