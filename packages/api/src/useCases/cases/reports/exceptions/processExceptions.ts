import type { CaseForExceptionReport, CaseRowForExceptionReport } from "@moj-bichard7/common/types/ExceptionReport"

import { convertCaseToCaseReportDto } from "../../../dto/convertCaseToDto"

export const processExceptions = (caseRowForReport: CaseRowForExceptionReport): CaseForExceptionReport => {
  return convertCaseToCaseReportDto(caseRowForReport)
}
