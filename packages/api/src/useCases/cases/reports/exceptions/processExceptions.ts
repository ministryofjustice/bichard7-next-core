import type {
  CaseForExceptionReport,
  CaseRowForExceptionReport
} from "@moj-bichard7/common/types/reports/ExceptionReport"

import { caseToExceptionsReportDto } from "../../../dto/reports/caseToExceptionsReportDto"

export const processExceptions = (caseRowForReport: CaseRowForExceptionReport): CaseForExceptionReport => {
  return caseToExceptionsReportDto(caseRowForReport)
}
