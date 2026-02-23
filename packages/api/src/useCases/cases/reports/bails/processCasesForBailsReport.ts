import type { CaseForBailsReportDto } from "@moj-bichard7/common/types/reports/Bails"

import type { CaseRowForBailsReport } from "../../../../types/reports/Bails"

import { caseToBailsReportDto } from "../../../dto/reports/caseToBailsReportDto"

export const processCasesForBailsReport = (cases: CaseRowForBailsReport[]): CaseForBailsReportDto[] => {
  return cases.flatMap((caseRow) => [...caseToBailsReportDto(caseRow)])
}
