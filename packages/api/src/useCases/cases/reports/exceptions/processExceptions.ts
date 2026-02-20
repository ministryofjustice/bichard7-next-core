import type { CaseForExceptionReportDto } from "@moj-bichard7/common/contracts/ExceptionReport"

import type { CaseRowForExceptionReport } from "../../../../types/reports/Exceptions"

import { caseToExceptionsReportDto } from "../../../dto/reports/caseToExceptionsReportDto"

export const processExceptions = (caseRowForReport: CaseRowForExceptionReport): CaseForExceptionReportDto => {
  return caseToExceptionsReportDto(caseRowForReport)
}
